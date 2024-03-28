import { Component } from "@angular/core";
import { faArrowLeft, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

@Component({
	selector: "app-chat-room",
	templateUrl: "./chat-room.component.html",
	styleUrl: "./chat-room.component.scss"
})
export class ChatRoomComponent {
	public faEllipsisVertical: IconDefinition = faEllipsisVertical;
	public faArrowLeft: IconDefinition = faArrowLeft;
}
