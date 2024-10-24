import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ChatService } from "../../services/chat.service";
import { filter, Observable, switchMap, takeUntil } from "rxjs";
import { User } from "@shared/models/user.model";
import { Conversation } from "@modules/chat/models/conversation.models";
import { Router } from "@angular/router";
import { ClearObservable } from "@utils/clear-observable";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { DialogService } from "@ngneat/dialog";
import { NewChatModalComponent } from "@modules/chat/components/new-chat-modal/new-chat-modal.component";

@Component({
	selector: "app-chat-list",
	templateUrl: "./chat-list.component.html",
	styleUrl: "./chat-list.component.scss"
})
export class ChatListComponent extends ClearObservable implements OnInit, AfterViewInit {
	protected readonly faPlus = faPlus;

	public conversationList: Conversation[] = [];
	// public users$: Observable<User[]>;

	constructor(
		private chatService: ChatService,
		private router: Router,
		private dialogService: DialogService
	) {
		super();
	}

	public ngOnInit(): void {
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

		this.chatService
			.getConversations()
			.pipe(takeUntil(this.destroy$))
			.subscribe(response => {
				this.conversationList = response;

				this.chatService.emitOnlineUsers();
			});

		this.chatService
			.roomDeleted()
			.pipe(takeUntil(this.destroy$))
			.subscribe((roomId: number) => {
				console.log("room was deleted!", roomId);

				this.conversationList = this.conversationList.filter(item => item.roomId !== roomId);
			});

		this.chatService
			.lastMessages()
			.pipe(takeUntil(this.destroy$))
			.subscribe(response => {
				console.log("response: ", response);
				const { message, unreadMessageCount, roomId, user, conversationId } = response;

				const index = this.conversationList.findIndex(item => item.roomId === roomId);

				if (index > -1) {
					this.conversationList[index].message = message;
					this.conversationList[index].unreadMessagesCount = unreadMessageCount;
				} else {
					this.conversationList.push({
						id: conversationId,
						roomId,
						message,
						user,
						unreadMessagesCount: unreadMessageCount
					});
				}

				// TODO:: create a new SoundService
				const audio = new Audio("./assets/sounds/notification.wav");

				audio.volume = 0.5;
				audio.play();

				// this.conversationList = this.conversationList.map(item => {
				// 	if (item.roomId === message.roomId) {
				// 		item.message = message;
				// 		item.unreadMessagesCount = unreadMessageCount;
				// 	}
				//
				// 	return item;
				// });
			});
	}

	ngAfterViewInit(): void {}

	public onNewChat(): void {
		this.chatService
			.getUsers()
			.pipe(takeUntil(this.destroy$))
			.subscribe(users => {
				const dialogRef = this.dialogService.open(NewChatModalComponent, {
					data: {
						users
					}
				});

				dialogRef.afterClosed$
					.pipe(
						filter((result): result is number => !!result),
						switchMap((receiverId: number) => this.chatService.createConversation(receiverId)),
						takeUntil(this.destroy$)
					)
					.subscribe((response: any) => {
						console.log("res: ", response);

						this.router.navigate([response.roomId]);
					});
			});
	}
}
