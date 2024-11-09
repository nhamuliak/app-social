import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChatRoomComponent } from "./chat-room.component";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import {
	MockAudioService,
	MockAuthService,
	MockChatService,
	MockChatSocketService,
	MockDialogService,
	MockToastrService
} from "@mock/services";
import { of, Subject } from "rxjs";
import { ChatService } from "@modules/chat/services/chat/chat.service";
import { ChatSocketService } from "@modules/chat/services/chat-socket/chat-socket.service";
import { DialogService } from "@ngneat/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Conversation } from "@modules/chat/models/conversation.model";
import { mockConversationListData, mockMessageData, mockMessageListData, mockUserData } from "@mock/data";
import { ToastrService } from "ngx-toastr";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import { PaginationResponse, User } from "@shared/models";
import { Message } from "@modules/chat/models/message.model";
import { AudioService } from "@core/services/audio/audio.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { MockRouter } from "@mock/helpers";

// Mock ActivatedRoute
const activatedRouteStub = {
	snapshot: {
		paramMap: {
			get: (key: string) => {
				if (key === "roomId") {
					return 1; // return a mock roomId, change as needed
				}
				return null;
			}
		}
	}
};

describe("ChatRoomComponent", () => {
	const roomId = 1;

	let component: ChatRoomComponent;
	let fixture: ComponentFixture<ChatRoomComponent>;

	let mockChatService: MockChatService;
	let mockChatSocketService: MockChatSocketService;
	let mockDialogService: MockDialogService;
	let mockToastrService: MockToastrService;
	let mockRouter: MockRouter;

	const destroy$ = new Subject<void>();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FontAwesomeTestingModule, HttpClientTestingModule],
			declarations: [ChatRoomComponent],
			providers: [
				{
					provide: ChatService,
					useClass: MockChatService
				},
				{
					provide: ChatSocketService,
					useClass: MockChatSocketService
				},
				{
					provide: DialogService,
					useClass: MockDialogService
				},
				{
					provide: ToastrService,
					useClass: MockToastrService
				},
				{
					provide: Router,
					useClass: MockRouter
				},
				{
					provide: AudioService,
					useClass: MockAudioService
				},
				{
					provide: ActivatedRoute,
					useValue: activatedRouteStub
				},
				{
					provide: AuthService,
					useClass: MockAuthService
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ChatRoomComponent);
		component = fixture.componentInstance;

		mockChatService = TestBed.inject(ChatService) as unknown as MockChatService;
		mockChatSocketService = TestBed.inject(ChatSocketService) as unknown as MockChatSocketService;
		mockDialogService = TestBed.inject(DialogService) as unknown as MockDialogService;
		mockToastrService = TestBed.inject(ToastrService) as unknown as MockToastrService;
		mockRouter = TestBed.inject(Router) as unknown as MockRouter;

		// fixture.detectChanges();
	});

	afterEach(() => {
		destroy$.next();
		destroy$.complete();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize page on ngOnInit", () => {
		const mockReceiver: User = mockUserData;
		const mockMessages: PaginationResponse<Message> = mockMessageListData;
		const mockConversations: Conversation[] = mockConversationListData;

		mockChatService.getReceiver.mockReturnValue(of(mockReceiver));
		mockChatService.getMessages.mockReturnValue(of(mockMessages));
		mockChatService.getLatestConversations.mockReturnValue(of(mockConversations));

		component.ngOnInit();

		expect(mockChatService.getReceiver).toHaveBeenCalledWith(1);
		expect(mockChatService.getMessages).toHaveBeenCalled();
		expect(component.messages).toEqual(mockMessages.records);
		expect(component.latestConversations).toEqual(mockConversations);
	});

	it("should delete conversation and navigate to root on delete confirmation", () => {
		const dialogRefMock = { afterClosed$: of(1) };

		jest.spyOn(mockDialogService, "open").mockReturnValue(dialogRefMock);

		component.roomId = roomId;
		component.receiver = mockUserData;
		component.onDeleteConversation();

		expect(mockDialogService.open).toHaveBeenCalled();
		expect(mockChatService.deleteConversation).toHaveBeenCalledWith(roomId, mockUserData.id);
	});

	it("should add emoji to message input", () => {
		component.message = "Hello ";
		component.onAddEmoji({ emoji: { native: "😊" } } as EmojiEvent);

		expect(component.message).toBe("Hello 😊");
	});

	it("should save message and reset input", () => {
		component.message = "New Message";
		component.roomId = roomId;
		component.receiver = mockUserData;

		component.saveMessage();

		expect(mockChatService.createMessage).toHaveBeenCalledWith(1, 1, "New Message");
		expect(component.message).toBe("");
	});

	it("should scroll to bottom when new message is received", () => {
		const mockMsg = mockMessageData;
		mockChatSocketService.checkNewMessage.mockReturnValue(of(mockMsg));

		component.messages = [];
		component.roomId = roomId;
		component.receiver = mockUserData;
		component["checkNewMessage"]();

		expect(component.messages).toContain(mockMsg);
	});

	it("should update online status when users are online", () => {
		const mockIdList = [1];
		component.receiver = mockUserData;
		mockChatSocketService.checkOnlineUsers.mockReturnValue(of(mockIdList));

		component["checkOnlineUserStatus"]();

		expect(component.receiver.isOnline).toBe(true);
	});

	it("should show notification when room is deleted", () => {
		mockChatSocketService.checkIsRoomDeleted.mockReturnValue(of(true));

		component.receiver = mockUserData;
		component["checkIsRoomWasDeleted"]();

		expect(mockToastrService.info).toHaveBeenCalled();
		expect(mockRouter.navigate).toHaveBeenCalledWith(["/"]);
	});
});
