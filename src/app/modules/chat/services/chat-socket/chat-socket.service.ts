import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CustomSocketService } from "@core/services/custom-socket/custom-socket.service";
import { Message } from "@modules/chat/models/message.model";
import { Conversation } from "@modules/chat/models/conversation.model";

@Injectable({
	providedIn: "root"
})
export class ChatSocketService {
	constructor(private socket: CustomSocketService) {}

	public checkIsRoomDeleted(): Observable<number> {
		return this.socket.fromEvent("room-was-deleted");
	}

	public checkNewMessage(): Observable<Message> {
		return this.socket.fromEvent("message");
	}

	public markMessagesAsRead(roomId: number, senderId: number): void {
		this.socket.emit("mark-messages-as-read", { roomId, senderId });
	}

	public checkLastMessages(): Observable<Conversation> {
		return this.socket.fromEvent("last-messages"); // get new created messages for the room
	}

	public checkOnlineUsers(): Observable<number[]> {
		return this.socket.fromEvent<number[]>("online-users");
	}
}
