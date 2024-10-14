import { Component, OnInit } from "@angular/core";
import { faArrowLeft, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ChatService } from "@modules/chat/services/chat.service";
import { ClearObservable } from "@utils/clear-observable";
import { ActivatedRoute } from "@angular/router";
import { Message } from "@modules/chat/models/message.models";
import { take, takeUntil } from "rxjs";
import { User } from "@modules/chat/models/user.models";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { Payload } from "@modules/auth/models/auth.models";

@Component({
	selector: "app-chat-room",
	templateUrl: "./chat-room.component.html",
	styleUrl: "./chat-room.component.scss"
})
export class ChatRoomComponent extends ClearObservable implements OnInit {
	public faEllipsisVertical: IconDefinition = faEllipsisVertical;
	public faArrowLeft: IconDefinition = faArrowLeft;

	public currentUser: Payload;
	public messages: Message[];
	public receiver: User;
	public roomId: number;

	constructor(
		private chatService: ChatService,
		private authService: AuthService,
		private route: ActivatedRoute
	) {
		super();
	}

	public ngOnInit(): void {
		this.roomId = Number(this.route.snapshot.paramMap.get("roomId")) || 0;
		// console.log("this.roomId: ", this.roomId);

		this.currentUser = this.authService.getUser();

		// console.log("this.currentUser: ", this.currentUser);

		this.chatService
			.getReceiver(this.roomId)
			.pipe(take(1))
			.subscribe(response => {
				this.receiver = response;
			});

		this.chatService
			.getMessages(this.roomId)
			.pipe(take(1))
			.subscribe(response => {
				this.messages = response;
			});

		// this.chatService.getMessagesByRoomId(+this.roomId);

		// this.chatService.getMessages().subscribe(messages => {
		// 	// console.log("messages: ", messages);
		//
		// 	this.messages = messages;
		// });

		// this.chatService
		// 	.getNewMessage()
		// 	// .pipe(takeUntil(this.destroy$))
		// 	.subscribe(message => {
		// 		// console.log("msg:: ", message);
		// 		this.messages.push(message);
		//
		// 		// console.log("messages2: ", this.messages);
		// 	});
	}

	public saveMessage(event: any): void {
		const message = event.target.value;
		console.log("click!", message);

		if (message?.trim()) {
			this.chatService
				.createMessage(this.roomId, message)
				.pipe(takeUntil(this.destroy$))
				.subscribe(response => {
					this.messages.push(response);
				});
		}

		event.target.value = "";
	}
}
