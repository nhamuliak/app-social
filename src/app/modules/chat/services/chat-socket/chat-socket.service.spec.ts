import { TestBed } from "@angular/core/testing";

import { ChatSocketService } from "./chat-socket.service";
import { CustomSocketService } from "@core/services/custom-socket/custom-socket.service";
import { MockCustomSocketService } from "@mock/services";
import { Conversation } from "@modules/chat/models/conversation.model";
import { mockConversationData, mockMessageData } from "@mock/data";
import { Message } from "@modules/chat/models/message.model";

describe("ChatSocketService", () => {
	let service: ChatSocketService;
	let mockSocketService: MockCustomSocketService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: CustomSocketService,
					useClass: MockCustomSocketService
				}
			]
		});
		service = TestBed.inject(ChatSocketService);
		mockSocketService = TestBed.inject(CustomSocketService) as unknown as MockCustomSocketService;
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	it("should check if a room is deleted", done => {
		const roomId = 1;
		mockSocketService.emit("room-was-deleted", roomId);

		service.checkIsRoomDeleted().subscribe(deletedRoomId => {
			expect(deletedRoomId).toBe(roomId);
			done();
		});
	});

	it("should emit send message", () => {
		const roomId = 1;
		const receiverId = 2;
		const content = "Hello!";

		service.emitSendMessage(roomId, receiverId, content);

		// Verify that the message was emitted
		expect(mockSocketService.events["send-message"]).toContainEqual({ roomId, receiverId, content });
	});

	it("should check for a new message", done => {
		const newMessage: Message = mockMessageData;
		mockSocketService.emit("message", newMessage);

		service.checkNewMessage().subscribe(message => {
			expect(message).toEqual(newMessage);
			done();
		});
	});

	it("should mark messages as read", () => {
		const roomId = 1;
		const senderId = 2;

		service.markMessagesAsRead(roomId, senderId);

		// Verify that the mark-messages-as-read event was emitted
		expect(mockSocketService.events["mark-messages-as-read"]).toContainEqual({ roomId, senderId });
	});

	it("should check last messages", done => {
		const conversation: Conversation = mockConversationData;
		mockSocketService.emit("last-messages", conversation);

		service.checkLastMessages().subscribe(lastConversation => {
			expect(lastConversation).toEqual(conversation);
			done();
		});
	});

	it("should check online users", done => {
		const onlineUsers = [1, 2, 3];
		mockSocketService.emit("online-users", onlineUsers);

		service.checkOnlineUsers().subscribe(users => {
			expect(users).toEqual(onlineUsers);
			done();
		});
	});
});
