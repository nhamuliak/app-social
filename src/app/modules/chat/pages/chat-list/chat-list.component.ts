import { Component, OnInit } from "@angular/core";
import { ChatService } from "../../services/chat.service";
import { Observable } from "rxjs";
import { User } from "@modules/chat/models/user.models";
import { Conversation } from "@modules/chat/models/conversation.models";
import { Router } from "@angular/router";

@Component({
	selector: "app-chat-list",
	templateUrl: "./chat-list.component.html",
	styleUrl: "./chat-list.component.scss"
})
export class ChatListComponent implements OnInit {
	public conversationList$: Observable<Conversation[]>;
	public users$: Observable<User[]>;
	public rooms: unknown[];
	public openDialog: boolean = false;

	constructor(
		private chatService: ChatService,
		private router: Router
	) {}

	public ngOnInit(): void {
		this.conversationList$ = this.chatService.getConversations();
		this.users$ = this.chatService.getUsers();

		// this.chatService.getRoomsByUserId(1);

		// this.chatService.getRooms().subscribe(rooms => {
		// 	// console.log("rooms", rooms);
		// 	this.rooms = rooms;
		// });
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
