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

	constructor(private chatService: ChatService) {}

	public ngOnInit(): void {
		this.chatList$ = this.chatService.getChatList();
	}
}
