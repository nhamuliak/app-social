import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { faArrowLeft, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ChatService } from "@modules/chat/services/chat/chat.service";
import { ClearObservable } from "@utils/clear-observable";
import { ActivatedRoute, Router } from "@angular/router";
import { Message } from "@modules/chat/models/message.model";
import { filter, finalize, forkJoin, switchMap, takeUntil } from "rxjs";
import { User } from "@shared/models/user.model";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { Conversation } from "@modules/chat/models/conversation.model";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import { Page } from "@utils/page";
import { DialogService } from "@ngneat/dialog";
import { ConfirmationModalComponent } from "@shared/components/confirmation-modal/confirmation-modal.component";
import { ChatSocketService } from "@modules/chat/services/chat-socket/chat-socket.service";
import { AudioService } from "@core/services/audio/audio.service";
import { ToastrService } from "ngx-toastr";
import { PaginationResponse } from "@shared/models";

@Component({
	selector: "app-chat-room",
	templateUrl: "./chat-room.component.html",
	styleUrl: "./chat-room.component.scss"
})
export class ChatRoomComponent extends ClearObservable implements OnInit {
	@ViewChild("roomContainer", { static: false }) private roomContainer: ElementRef;

	public faEllipsisVertical: IconDefinition = faEllipsisVertical;
	public faArrowLeft: IconDefinition = faArrowLeft;

	public menuOpened = false;
	public loading = false;
	public loadingUpMessages = false;

	public page = new Page(100);
	public roomId: number;
	public message = "";
	public showEmojiMart = false;
	public currentUser: User | null;
	public receiver: User;
	public messages: Message[];
	public latestConversations: Conversation[];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private authService: AuthService,
		private dialogService: DialogService,
		private audioService: AudioService,
		private chatService: ChatService,
		private chatSocketService: ChatSocketService,
		private toastrService: ToastrService
	) {
		super();
	}

	public ngOnInit(): void {
		this.initPage();
	}

	public onDeleteConversation(): void {
		this.menuOpened = false;

		this.deleteConversation();
	}

	public onSelectRoom(roomId: number): void {
		this.router.navigate(["/" + roomId]).then(() => {
			this.initPage();
		});
	}

	public onAddEmoji({ emoji }: EmojiEvent): void {
		this.message += emoji.native;
	}

	public onKeydown({ ctrlKey, key }: KeyboardEvent): void {
		if (ctrlKey && key === "Enter") {
			this.saveMessage();
		}
	}

	public saveMessage(): void {
		if (this.message?.trim()) {
			this.chatService
				.createMessage(this.roomId, this.receiver.id, this.message)
				.pipe(takeUntil(this.destroy$))
				.subscribe(message => {
					this.messages.push(message);

					const index = this.latestConversations.findIndex(item => item.roomId === message.roomId);

					if (index >= 0) {
						this.latestConversations[index].message = message;
					}

					this.scrollToBottom();
				});

			this.message = "";
		}
	}

	@HostListener("window:scroll", [])
	public onWindowScroll(): void {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;

		if (scrollTop === 0 && this.loading === false) {
			const currentScrollHeight = document.documentElement.scrollHeight;

			if (this.messages.length < this.page.total) {
				this.loadingUpMessages = true;
				this.page.pageNumber += 1;

				this.chatService
					.getMessages(this.roomId, this.page.pageNumber, this.page.size)
					.pipe(
						finalize(() => (this.loadingUpMessages = false)),
						takeUntil(this.destroy$)
					)
					.subscribe(result => {
						this.messages = [...result.records, ...this.messages];

						setTimeout(() => {
							// Calculate the new scroll position based on the height change
							const newScrollHeight = document.documentElement.scrollHeight;

							window.scrollTo(0, newScrollHeight - currentScrollHeight);
						}, 0);
					});
			}
		}
	}

	private initPage(): void {
		this.loading = true;

		this.currentUser = this.authService.user;

		this.roomId = Number(this.route.snapshot.paramMap.get("roomId")) || 0;

		this.chatService
			.getReceiver(this.roomId)
			.pipe(
				switchMap((receiver: User) => {
					this.receiver = receiver;

					this.chatSocketService.markMessagesAsRead(this.roomId, this.receiver.id);

					return forkJoin([
						this.chatService.getMessages(this.roomId, this.page.pageNumber, this.page.size),
						this.chatService.getLatestConversations(this.roomId)
					]);
				}),
				finalize(() => (this.loading = false)),
				takeUntil(this.destroy$)
			)
			.subscribe(([result, conversations]: [PaginationResponse<Message>, Conversation[]]) => {
				this.latestConversations = conversations;

				this.messages = result.records;
				this.page.total = result.total;

				this.checkNewMessage();
				this.checkOnlineUserStatus();
				this.checkNewLastMessages();
				this.checkIsRoomWasDeleted();

				this.scrollToBottom();
			});
	}

	private deleteConversation(): void {
		const dialogRef = this.dialogService.open(ConfirmationModalComponent, {
			size: "md",
			backdrop: true,
			data: {
				title: "Are you sure you want to delete this conversation?"
			}
		});

		dialogRef.afterClosed$
			.pipe(
				filter(result => !!result),
				switchMap(() => this.chatService.deleteConversation(this.roomId, this.receiver.id)),
				takeUntil(this.destroy$)
			)
			.subscribe(() => {
				this.router.navigate(["/"]);
			});
	}

	private checkNewMessage(): void {
		this.chatSocketService
			.checkNewMessage()
			.pipe(takeUntil(this.destroy$))
			.subscribe(msg => {
				if (msg.roomId === this.roomId) {
					this.messages.push(msg);
					this.chatSocketService.markMessagesAsRead(this.roomId, this.receiver.id);
					this.scrollToBottom();
				} else {
					this.audioService.playNotification();
				}
			});
	}

	private checkNewLastMessages(): void {
		this.chatSocketService
			.checkLastMessages()
			.pipe(takeUntil(this.destroy$))
			.subscribe(({ message, unreadMessagesCount, roomId, user, id }: Conversation) => {
				const index = this.latestConversations.findIndex(item => item.roomId === roomId);

				if (index > -1) {
					this.latestConversations[index].message = message;

					if (user.id !== this.receiver.id && user.id !== this.currentUser?.id) {
						this.latestConversations[index].unreadMessagesCount = unreadMessagesCount;
					}
				} else {
					this.latestConversations.push({
						id,
						roomId,
						message,
						user,
						unreadMessagesCount
					});
				}
			});
	}

	private checkIsRoomWasDeleted(): void {
		this.chatSocketService
			.checkIsRoomDeleted()
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.toastrService.info(
					`The conversation was deleted by ${this.receiver.firstName} ${this.receiver.lastName}.`
				);
				this.router.navigate(["/"]);
			});
	}

	private checkOnlineUserStatus(): void {
		this.chatSocketService
			.checkOnlineUsers()
			.pipe(takeUntil(this.destroy$))
			.subscribe((idList: number[]) => {
				this.receiver.isOnline = idList.includes(this.receiver.id);

				this.latestConversations = this.latestConversations.map(item => {
					const userId = idList.find(id => id == item.user.id) || null;

					item.user.isOnline = Boolean(userId);

					return item;
				});
			});
	}

	private scrollToBottom(): void {
		setTimeout(() => {
			window.scroll({
				top: this.roomContainer.nativeElement.scrollHeight,
				behavior: "smooth"
			});
		}, 100);
	}
}
