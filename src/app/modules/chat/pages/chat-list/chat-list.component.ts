import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ChatService } from "../../services/chat.service";
import { Observable, takeUntil } from "rxjs";
import { User } from "@modules/chat/models/user.models";
import { Conversation } from "@modules/chat/models/conversation.models";
import { Router } from "@angular/router";
import { ClearObservable } from "@utils/clear-observable";

@Component({
	selector: "app-chat-list",
	templateUrl: "./chat-list.component.html",
	styleUrl: "./chat-list.component.scss"
})
export class ChatListComponent extends ClearObservable implements OnInit, AfterViewInit {
	public conversationList: Conversation[];
	public users$: Observable<User[]>;
	// public rooms: unknown[];
	public openDialog: boolean = false;

	constructor(
		private chatService: ChatService,
		private router: Router
	) {
		super();
	}

	public ngOnInit(): void {
		this.chatService
			.getConversations()
			.pipe(takeUntil(this.destroy$))
			.subscribe(response => {
				this.conversationList = response;

				this.chatService.emitOnlineUsers();
			});

		this.chatService
			.lastMessages()
			.pipe(takeUntil(this.destroy$))
			.subscribe(({ message, unreadMessageCount }) => {
				console.log("response: ", message, unreadMessageCount);

				this.conversationList = this.conversationList.map(item => {
					if (item.roomId === message.roomId) {
						item.message = message;
						item.unreadMessagesCount = unreadMessageCount;
					}

					return item;
				});
			});

		this.users$ = this.chatService.getUsers();
	}

	ngAfterViewInit(): void {
		// Online users
		this.chatService
			.getOnlineUsersId()
			.pipe(takeUntil(this.destroy$))
			.subscribe((userIdList: number[]) => {
				console.log("userIdList: ", userIdList);

				this.conversationList = this.conversationList?.map(item => {
					const userId = userIdList.find(id => id == item.user?.id);

					item.user.isOnline = Boolean(userId);

					return item;
				});
			});
	}

	public onNewConversation(receiverId: number): void {
		console.log("receiverId", receiverId);

		this.chatService
			.createConversation(receiverId)
			.pipe()
			.subscribe(res => {
				this.openDialog = false;

				this.router.navigate([res.roomId]);
				console.log("res: ", res);
			});
	}
}
