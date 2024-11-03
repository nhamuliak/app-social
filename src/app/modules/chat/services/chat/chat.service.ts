import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { User } from "@shared/models/user.model";
import { Conversation } from "@modules/chat/models/conversation.model";
import { Message } from "@modules/chat/models/message.model";
import { PaginationResponse } from "@shared/models";
import { environment } from "@environments/environment";

@Injectable({
	providedIn: "root"
})
export class ChatService {
	private readonly urlPath = `${environment.apiUrl}/chat`;

	constructor(private http: HttpClient) {}

	public getConversations(): Observable<Conversation[]> {
		return this.http.get<Conversation[]>(this.urlPath);
	}

	public getLatestConversations(conversationId: number): Observable<Conversation[]> {
		return this.http.get<Conversation[]>(`${this.urlPath}/${conversationId}/latest-conversations`);
	}

	public createConversation(receiverId: number): Observable<Conversation> {
		return this.http.post<Conversation>(this.urlPath, { receiverId });
	}

	public deleteConversation(roomId: number, receiverId: number): Observable<void> {
		return this.http.delete<void>(`${this.urlPath}/${roomId}`, { body: { receiverId } });
	}

	// TODO:: move to user service
	public getUsers(): Observable<User[]> {
		return this.http.get<PaginationResponse<User>>(`${environment.rootUrl}/api/user`).pipe(
			map(response => {
				return response.records;
			})
		);
	}

	public getMessages(conversationId: number, page: number, size: number): Observable<PaginationResponse<Message>> {
		return this.http.get<PaginationResponse<Message>>(`${this.urlPath}/${conversationId}/messages`, {
			params: {
				page,
				size
			}
		});
	}

	public createMessage(roomId: number, receiverId: number, content: string): Observable<Message> {
		return this.http.post<Message>(`${this.urlPath}/message`, { roomId, receiverId, content });
	}

	public getReceiver(conversationId: number): Observable<User> {
		return this.http.get<User>(`${this.urlPath}/${conversationId}/receiver`);
	}
}
