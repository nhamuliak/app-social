import { Injectable } from "@angular/core";
import { delay, map, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { PaginationResponse, User } from "@modules/chat/models/user.models";
import { Conversation } from "@modules/chat/models/conversation.models";
import { Message } from "@modules/chat/models/message.models";
import { CustomSocketService } from "@core/services/custom-socket/custom-socket.service";

@Injectable({
	providedIn: "root"
})
export class ChatService {
	private readonly urlPath = "http://localhost:3000";

	constructor(
		private http: HttpClient,
		private socket: CustomSocketService
	) {}

	public getConversations(): Observable<any[]> {
		return this.http.get<any[]>(`${this.urlPath}/api/chat`);
	}

	public getLatestConversations(conversationId: number): Observable<any[]> {
		return this.http.get<any[]>(`${this.urlPath}/api/chat/${conversationId}/latest-conversations`);
	}

	public createConversation(receiverId: number): Observable<Conversation> {
		return this.http.post<Conversation>(`${this.urlPath}/api/chat`, { receiverId });
	}

	public getUsers(): Observable<User[]> {
		return this.http.get<PaginationResponse<User[]>>(`${this.urlPath}/api/user`).pipe(
			map(response => {
				return response.records;
			})
		);
	}

	public getMessages(conversationId: number): Observable<Message[]> {
		return this.http.get<Message[]>(`${this.urlPath}/api/chat/${conversationId}/messages`);
	}

	public createMessage(roomId: number, content: string): Observable<Message> {
		return this.http.post<Message>(`${this.urlPath}/api/chat/messages`, {
			roomId,
			content
		});
	}

	public getReceiver(conversationId: number): Observable<User> {
		return this.http.get<User>(`${this.urlPath}/api/chat/${conversationId}/receiver`);
	}

	// Sockets

	public emitJoinRoom(roomId: number): void {
		return this.socket.emit("join-room", roomId);
	}

	public getMessagesLive(): Observable<Message[]> {
		return this.socket.fromEvent("messages");
	}

	public emitSendMessage(roomId: number, receiverId: number, content: string): void {
		return this.socket.emit("send-message", { roomId, receiverId, content });
	}

	public getMessage(): Observable<Message> {
		return this.socket.fromEvent("message");
	}

	public emitMarkAsReadMessages(roomId: number, senderId: number): void {
		this.socket.emit("mark-as-read-messages", { roomId, senderId });
	}

	public checkMessages(): Observable<Message[]> {
		return this.socket.fromEvent("checked-messages");
	}

	public lastMessages(): Observable<any> {
		return this.socket.fromEvent("last-messages");
	}

	// Socket
	public emitOnlineUsers(): void {
		return this.socket.emit("get-online-users");
	}

	public getOnlineUsersId(): Observable<number[]> {
		return this.socket.fromEvent<number[]>("online-users");
	}
}
