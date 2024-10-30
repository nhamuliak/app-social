import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

import { ChatService } from "./chat.service";
import { Conversation } from "@modules/chat/models/conversation.model";
import {
	mockConversationData,
	mockConversationListData,
	mockMessageListData,
	mockUserData,
	mockUserListData
} from "@mock/data";
import { environment } from "@environments/environment";
import { PaginationResponse, User } from "@shared/models";
import { Message } from "@modules/chat/models/message.model";
import { Page } from "@utils/page";

describe("ChatService", () => {
	let service: ChatService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule]
		});

		service = TestBed.inject(ChatService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	it("should get conversations", () => {
		const mockConversations: Conversation[] = mockConversationListData;

		service.getConversations().subscribe(conversations => {
			expect(conversations).toEqual(mockConversations);
		});

		const req = httpTestingController.expectOne(`${environment.apiUrl}/chat`);
		expect(req.request.method).toBe("GET");
		req.flush(mockConversations);
	});

	it("should get latest conversations for a conversationId", () => {
		const conversationId = 1;
		const mockLatestConversations = [{ id: 1, content: "Hi there!" }];

		service.getLatestConversations(conversationId).subscribe(conversations => {
			expect(conversations).toEqual(mockLatestConversations);
		});

		const req = httpTestingController.expectOne(
			`${environment.apiUrl}/chat/${conversationId}/latest-conversations`
		);
		expect(req.request.method).toBe("GET");
		req.flush(mockLatestConversations);
	});

	it("should create a conversation", () => {
		const receiverId = mockUserData.id;
		const mockConversation: Conversation = mockConversationData;

		service.createConversation(receiverId).subscribe(conversation => {
			expect(conversation).toEqual(mockConversation);
		});

		const req = httpTestingController.expectOne(`${environment.apiUrl}/chat`);
		expect(req.request.method).toBe("POST");
		expect(req.request.body).toEqual({ receiverId });
		req.flush(mockConversation);
	});

	it("should delete a conversation", () => {
		const roomId = mockConversationData.roomId;
		const receiverId = mockConversationData.user.id;

		service.deleteConversation(roomId, receiverId).subscribe(response => {
			expect(response).toBeUndefined();
		});

		const req = httpTestingController.expectOne(`${environment.apiUrl}/chat/${roomId}`);
		expect(req.request.method).toBe("DELETE");
		expect(req.request.body).toEqual({ receiverId });
		req.flush(null);
	});

	it("should get users", () => {
		const mockUsers: User[] = mockUserListData;

		const mockPaginationResponse: PaginationResponse<User> = {
			records: mockUsers,
			total: 1
		};

		service.getUsers().subscribe(users => {
			expect(users).toEqual(mockUsers);
		});

		const req = httpTestingController.expectOne(`${environment.rootUrl}/api/user`);
		expect(req.request.method).toBe("GET");
		req.flush(mockPaginationResponse);
	});

	it("should get messages for a conversation", () => {
		const conversationId = 1;
		const page = new Page();
		const mockMessages: PaginationResponse<Message> = mockMessageListData;

		service.getMessages(conversationId, page.pageNumber, page.size).subscribe(messages => {
			expect(messages).toEqual(mockMessages);
		});

		const req = httpTestingController.expectOne(
			`${environment.apiUrl}/chat/${conversationId}/messages?page=${page.pageNumber}&size=${page.size}`
		);
		expect(req.request.method).toBe("GET");
		req.flush(mockMessages);
	});

	it("should get receiver for a conversation", () => {
		const conversationId = 1;
		const mockReceiver: User = mockUserData;

		service.getReceiver(conversationId).subscribe(receiver => {
			expect(receiver).toEqual(mockReceiver);
		});

		const req = httpTestingController.expectOne(`${environment.apiUrl}/chat/${conversationId}/receiver`);
		expect(req.request.method).toBe("GET");
		req.flush(mockReceiver);
	});
});
