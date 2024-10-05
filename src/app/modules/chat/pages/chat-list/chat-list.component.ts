import { Component, OnInit } from "@angular/core";
import { ChatService } from "../../services/chat.service";
import { Observable } from "rxjs";

@Component({
	selector: "app-chat-list",
	templateUrl: "./chat-list.component.html",
	styleUrl: "./chat-list.component.scss"
})
export class ChatListComponent implements OnInit {
	public chatList$: Observable<unknown[]>;
	public rooms: unknown[];

	constructor(private chatService: ChatService) {}

	public ngOnInit(): void {
		this.chatList$ = this.chatService.getChatList();

		this.chatService.getRoomsByUserId(1);

		this.chatService.getRooms().subscribe(rooms => {
			// console.log("rooms", rooms);
			this.rooms = rooms;
		});
	}
}
