import { Injectable } from "@angular/core";
import { delay, map, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { io, Socket } from "socket.io-client";
import { PaginationResponse, User } from "@modules/chat/models/user.models";
import { Conversation } from "@modules/chat/models/conversation.models";
import { Message } from "@modules/chat/models/message.models";

@Injectable({
	providedIn: "root"
})
export class ChatService {
	private readonly urlPath = "http://localhost:3000";
	private socket: Socket;

	constructor(private http: HttpClient) {
		this.socket = io(`${this.urlPath}/chat`);
	}

	public getConversations(): Observable<any[]> {
		return this.http.get<any[]>(`${this.urlPath}/api/chat`);
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

	// ----------------- OLD DATA --------------------------------

	public getChatList(): Observable<unknown[]> {
		const data = new Array(40).fill("").map((_, index) => index + 1);

		return of(data).pipe(delay(500));
	}

	public createRoom(user1Id: number, user2Id: number): void {
		this.socket.emit("createRoom", { user1Id, user2Id });
	}

	public getRoomsByUserId(userId: number): void {
		this.socket.emit("getRoomByUserId", userId);
	}

	public getRooms(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on("getRooms", (rooms: unknown[]) => {
				observer.next(rooms);
			});
		});
	}

	// public createMessage(userId: number, roomId: number, message: string): void {
	// 	this.socket.emit("newMessage", { userId, roomId, message });
	// }

	public getMessagesByRoomId(roomId: number): void {
		this.socket.emit("getMessagesByRoomId", roomId);
	}

	// public getMessages(): Observable<any> {
	// 	return new Observable<any>(observer => {
	// 		this.socket.on("getMessages", (messages: unknown[]) => {
	// 			observer.next(messages);
	// 		});
	// 	});
	//
	// 	// this.socket.on("getMessages", cb);
	// }

	public getNewMessage(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on("message", message => {
				observer.next(message);
			});
		});
	}
}
