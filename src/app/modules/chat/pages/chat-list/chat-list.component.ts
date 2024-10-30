import { Component, OnInit } from "@angular/core";
import { ChatService } from "../../services/chat/chat.service";
import { filter, finalize, switchMap, takeUntil } from "rxjs";
import { Conversation } from "@modules/chat/models/conversation.model";
import { Router } from "@angular/router";
import { ClearObservable } from "@utils/clear-observable";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { DialogService } from "@ngneat/dialog";
import { NewChatModalComponent } from "@modules/chat/components/new-chat-modal/new-chat-modal.component";
import { AudioService } from "@core/services/audio/audio.service";
import { ChatSocketService } from "@modules/chat/services/chat-socket/chat-socket.service";
import { User } from "@shared/models";

@Component({
	selector: "app-chat-list",
	templateUrl: "./chat-list.component.html",
	styleUrl: "./chat-list.component.scss"
})
export class ChatListComponent extends ClearObservable implements OnInit {
	protected readonly faPlus = faPlus;

	public loading = true;
	public conversationList: Conversation[] = [];

	constructor(
		private router: Router,
		private dialogService: DialogService,
		private audioService: AudioService,
		private chatService: ChatService,
		private chatSocketService: ChatSocketService
	) {
		super();
	}

	public ngOnInit(): void {
		this.initConversations();
	}

	public onNewChat(): void {
		this.createNewConversation();
	}

	private createNewConversation(): void {
		this.chatService
			.getUsers()
			.pipe(takeUntil(this.destroy$))
			.subscribe((users: User[]) => {
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
					.subscribe((response: Conversation) => {
						this.router.navigate([response.roomId]);
					});
			});
	}

	private initConversations(): void {
		this.chatService
			.getConversations()
			.pipe(
				finalize(() => (this.loading = false)),
				takeUntil(this.destroy$)
			)
			.subscribe(response => {
				this.conversationList = response;

				this.checkOnlineUserStatus();
				this.checkNewLastMessages();
				this.checkIsRoomWasDeleted();
			});
	}

	private checkIsRoomWasDeleted(): void {
		this.chatSocketService
			.checkIsRoomDeleted()
			.pipe(takeUntil(this.destroy$))
			.subscribe((roomId: number) => {
				this.conversationList = this.conversationList.filter(item => item.roomId !== roomId);
			});
	}

	private checkNewLastMessages(): void {
		this.chatSocketService
			.checkLastMessages()
			.pipe(takeUntil(this.destroy$))
			.subscribe(({ message, unreadMessagesCount, roomId, user, id }: Conversation) => {
				const index = this.conversationList.findIndex(item => item.roomId === roomId);

				if (index > -1) {
					this.conversationList[index].message = message;
					this.conversationList[index].unreadMessagesCount = unreadMessagesCount;
				} else {
					this.conversationList.push({
						id,
						roomId,
						message,
						user,
						unreadMessagesCount
					});
				}

				this.audioService.playNotification();
			});
	}

	private checkOnlineUserStatus(): void {
		this.chatSocketService
			.checkOnlineUsers()
			.pipe(takeUntil(this.destroy$))
			.subscribe((idList: number[]) => {
				this.conversationList = this.conversationList?.map(item => {
					const userId = idList.find(id => id == item.user.id) || null;

					item.user.isOnline = Boolean(userId);

					return item;
				});
			});
	}
}
