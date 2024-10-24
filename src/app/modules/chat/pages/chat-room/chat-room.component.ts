import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { faArrowLeft, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ChatService } from "@modules/chat/services/chat.service";
import { ClearObservable } from "@utils/clear-observable";
import { ActivatedRoute, Router } from "@angular/router";
import { Message } from "@modules/chat/models/message.models";
import { filter, switchMap, take, takeUntil } from "rxjs";
import { User } from "@shared/models/user.model";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { Payload } from "@modules/auth/models/auth.models";
import { Conversation } from "@modules/chat/models/conversation.models";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import { Page } from "@utils/page";
import { DialogService } from "@ngneat/dialog";
import { ConfirmationModalComponent } from "@shared/components/confirmation-modal/confirmation-modal.component";

@Component({
	selector: "app-chat-room",
	templateUrl: "./chat-room.component.html",
	styleUrl: "./chat-room.component.scss"
})
export class ChatRoomComponent extends ClearObservable implements OnInit, AfterViewInit {
	@ViewChild("roomContainer", { static: false }) private roomContainer: ElementRef;

	public faEllipsisVertical: IconDefinition = faEllipsisVertical;
	public faArrowLeft: IconDefinition = faArrowLeft;

	public page = new Page(100);
	public message = "";
	public showEmojiMart = false;
	public currentUser: Payload;
	public messages: Message[];
	public receiver: User;
	public roomId: number;
	public latestConversations: Conversation[];

	constructor(
		private chatService: ChatService,
		private authService: AuthService,
		private route: ActivatedRoute,
		private router: Router,
		private dialogService: DialogService
	) {
		super();
	}

	public ngOnInit(): void {
		this.initPage();
	}

	public onDeleteConversation(): void {
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
				switchMap(result => {
					console.log("result", result);
					return this.chatService.deleteConversation(this.roomId);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe(res => {
				this.router.navigate(["/"]).then(() => {
					console.log("deleted!!!!", res, this.receiver.id, this.roomId);
					this.chatService.emitDeleteMessage(this.receiver.id, this.roomId);
				});
			});
	}

	public ngAfterViewInit(): void {
		this.chatService
			.getOnlineUsersId()
			.pipe(takeUntil(this.destroy$))
			.subscribe((userIdList: number[]) => {
				console.log("userIdList: ", userIdList);

				this.receiver.isOnline = userIdList.includes(this.receiver.id);

				this.latestConversations = this.latestConversations?.map(item => {
					const userId = userIdList.find(id => id == item.user?.id);

					item.user.isOnline = Boolean(userId);

					return item;
				});
			});
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
			this.chatService.emitSendMessage(this.roomId, this.receiver.id, this.message);

			this.message = "";
		}
	}

	private scrollToBottom(): void {
		setTimeout(() => {
			window.scroll({
				top: this.roomContainer.nativeElement.scrollHeight,
				behavior: "smooth"
			});
		}, 100);
	}

	private initPage(): void {
		this.roomId = Number(this.route.snapshot.paramMap.get("roomId")) || 0;
		// console.log("this.roomId: ", this.roomId);

		this.currentUser = this.authService.getUser();

		// console.log("this.currentUser: ", this.currentUser);

		this.chatService
			.getReceiver(this.roomId)
			.pipe(take(1))
			.subscribe(response => {
				this.receiver = response;

				this.chatService.emitOnlineUsers();
				this.chatService.emitMarkAsReadMessages(this.roomId, this.receiver.id);
				// this.chatService.emitJoinRoom(this.roomId);
				this.scrollToBottom();

				this.chatService
					.getLatestConversations(this.roomId)
					.pipe(takeUntil(this.destroy$))
					.subscribe(response => {
						console.log("getLatestConversations: ", response);

						this.latestConversations = response;
					});
			});

		this.chatService
			.getMessages(this.roomId, this.page.pageNumber, this.page.size)
			.pipe(takeUntil(this.destroy$))
			.subscribe(result => {
				console.log("res messages: ", result);
				this.messages = result.records;
				this.page.total = result.total;
			});

		this.chatService
			.getMessage()
			.pipe(takeUntil(this.destroy$))
			.subscribe(msg => {
				// console.log("msg: ", msg);
				if (msg.roomId === this.roomId) {
					this.messages.push(msg);
					this.scrollToBottom();
					this.chatService.emitMarkAsReadMessages(this.roomId, this.receiver.id);
				} else {
					// play sound if we get message from the different room
					// TODO:: create a new SoundService
					const audio = new Audio("./assets/sounds/notification2.mp3");

					audio.volume = 0.5;
					audio.play();
				}
			});

		this.chatService
			.roomDeleted()
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				console.log("room was deleted!");
				this.router.navigate(["/"]);
			});

		this.chatService
			.lastMessages()
			.pipe(takeUntil(this.destroy$))
			.subscribe(response => {
				console.log("response: ", response);
				const { message, unreadMessageCount, roomId, user, conversationId } = response;

				const index = this.latestConversations.findIndex(item => item.roomId === roomId);

				if (index > -1) {
					this.latestConversations[index].message = message;

					if (message.userId !== this.receiver.id && message.userId !== this.currentUser.id) {
						this.latestConversations[index].unreadMessagesCount = unreadMessageCount;
					}
				} else {
					this.latestConversations.push({
						id: conversationId,
						roomId,
						message,
						user,
						unreadMessagesCount: unreadMessageCount
					});
				}

				// this.latestConversations = this.latestConversations.map(item => {
				// 	if (item.roomId === message.roomId) {
				// 		item.message = message;
				//
				// 		// update unread message count only when we get messages from other users
				// 		if (message.userId !== this.receiver.id && message.userId !== this.currentUser.id) {
				// 			item.unreadMessagesCount = unreadMessageCount;
				// 		}
				// 	}
				//
				// 	return item;
				// });
			});
	}
}
