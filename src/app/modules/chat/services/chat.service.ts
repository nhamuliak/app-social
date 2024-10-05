import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { io, Socket } from "socket.io-client";

@Injectable({
	providedIn: "root"
})
export class ChatService {
	private readonly urlPath = "http://localhost:3000";
	private socket: Socket;

	constructor(private _http: HttpClient) {
		this.socket = io(`${this.urlPath}/chat`);
	}

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

	public createMessage(userId: number, roomId: number, message: string): void {
		this.socket.emit("newMessage", { userId, roomId, message });
	}

	public getMessagesByRoomId(roomId: number): void {
		this.socket.emit("getMessagesByRoomId", roomId);
	}

	public getMessages(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on("getMessages", (messages: unknown[]) => {
				observer.next(messages);
			});
		});

		// this.socket.on("getMessages", cb);
	}

	public getNewMessage(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on("message", message => {
				observer.next(message);
			});
		});
	}
}
