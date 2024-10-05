import { Component, OnInit } from "@angular/core";
import { faArrowLeft, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ChatService } from "@modules/chat/services/chat.service";
import { ClearObservable } from "@utils/clear-observable";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "app-chat-room",
	templateUrl: "./chat-room.component.html",
	styleUrl: "./chat-room.component.scss"
})
export class ChatRoomComponent extends ClearObservable implements OnInit {
	public faEllipsisVertical: IconDefinition = faEllipsisVertical;
	public faArrowLeft: IconDefinition = faArrowLeft;

	public messages: unknown[] = [];
	public roomId: number;

	constructor(
		private chatService: ChatService,
		private route: ActivatedRoute
	) {
		super();
	}

	public ngOnInit(): void {
		this.roomId = Number(this.route.snapshot.paramMap.get("roomId")) || 0;

		this.chatService.getMessagesByRoomId(+this.roomId);

		this.chatService.getMessages().subscribe(messages => {
			// console.log("messages: ", messages);

			this.messages = messages;
		});

		this.chatService
			.getNewMessage()
			// .pipe(takeUntil(this.destroy$))
			.subscribe(message => {
				// console.log("msg:: ", message);
				this.messages.push(message);

				// console.log("messages2: ", this.messages);
			});
	}

	public saveMessage(event: any): void {
		const message = event.target.value;
		// console.log("click!", message);

		if (message?.trim()) {
			this.chatService.createMessage(1, this.roomId, message);
		}

		event.target.value = "";
	}
}
