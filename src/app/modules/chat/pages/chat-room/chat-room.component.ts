import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { faArrowLeft, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ChatService } from "@modules/chat/services/chat.service";
import { ClearObservable } from "@utils/clear-observable";
import { ActivatedRoute, Router } from "@angular/router";
import { Message } from "@modules/chat/models/message.models";
import { take, takeUntil } from "rxjs";
import { User } from "@modules/chat/models/user.models";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { Payload } from "@modules/auth/models/auth.models";
import { Conversation } from "@modules/chat/models/conversation.models";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji";

@Component({
	selector: "app-chat-room",
	templateUrl: "./chat-room.component.html",
	styleUrl: "./chat-room.component.scss"
})
export class ChatRoomComponent extends ClearObservable implements OnInit, AfterViewInit {
	@ViewChild("roomContainer", { static: false }) private roomContainer: ElementRef;

	public faEllipsisVertical: IconDefinition = faEllipsisVertical;
	public faArrowLeft: IconDefinition = faArrowLeft;

	public message: string = "";
	public showEmojiMart: boolean = false;
	public currentUser: Payload;
	public messages: Message[];
	public receiver: User;
	public roomId: number;
	public latestConversations: Conversation[];

	constructor(
		private chatService: ChatService,
		private authService: AuthService,
		private route: ActivatedRoute,
		private router: Router
	) {
		super();
	}

	public ngOnInit(): void {
		this.initPage();
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
		}

		this.message = "";
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
				this.chatService.emitJoinRoom(this.roomId);
				this.scrollToBottom();
			});

		this.chatService
			.getMessagesLive()
			.pipe(takeUntil(this.destroy$))
			.subscribe(response => {
				console.log("res live messages: ", response);
				this.messages = response;
			});

		this.chatService
			.getMessage()
			.pipe(takeUntil(this.destroy$))
			.subscribe(msg => {
				// console.log("msg: ", msg);
				if (msg.roomId === this.roomId) {
					this.messages.push(msg);
					this.scrollToBottom();
				}
			});

		this.chatService
			.checkMessages()
			.pipe(takeUntil(this.destroy$))
			.subscribe(res => {
				console.log("checked messages!");
			});

		this.chatService
			.getLatestConversations(this.roomId)
			.pipe(takeUntil(this.destroy$))
			.subscribe(response => {
				console.log("getLatestConversations: ", response);

				this.latestConversations = response;
			});

		this.chatService
			.lastMessages()
			.pipe(takeUntil(this.destroy$))
			.subscribe(({ message, unreadMessageCount }) => {
				console.log("response: ", message, unreadMessageCount);

				this.latestConversations = this.latestConversations.map(item => {
					if (item.roomId === message.roomId) {
						item.message = message;

						// update unread message count only when we get messages from other users
						if (message.userId !== this.receiver.id && message.userId !== this.currentUser.id) {
							item.unreadMessagesCount = unreadMessageCount;
						}
					}

					return item;
				});
			});
	}
}
