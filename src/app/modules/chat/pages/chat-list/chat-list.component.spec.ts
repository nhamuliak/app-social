import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChatListComponent } from "./chat-list.component";
import { ChatService } from "../../services/chat/chat.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of, Subject } from "rxjs";
import { Conversation } from "@modules/chat/models/conversation.model";
import { MockAudioService, MockChatService, MockChatSocketService, MockDialogService } from "@mock/services";
import { ChatSocketService } from "@modules/chat/services/chat-socket/chat-socket.service";
import { DialogService } from "@ngneat/dialog";
import { AudioService } from "@core/services/audio/audio.service";
import { mockConversationData, mockConversationListData, mockUserListData } from "@mock/data";
import { User } from "@shared/models";
import { Router } from "@angular/router";
import { MockRouter } from "@mock/helpers";

describe("ChatListComponent", () => {
	let component: ChatListComponent;
	let fixture: ComponentFixture<ChatListComponent>;

	let mockChatService: MockChatService;
	let mockChatSocketService: MockChatSocketService;
	let mockDialogService: MockDialogService;
	let mockAudioService: MockAudioService;
	let mockRouter: MockRouter;

	const destroy$ = new Subject<void>();

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [ChatListComponent],
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
					provide: AudioService,
					useClass: MockAudioService
				},
				{
					provide: Router,
					useClass: MockRouter
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ChatListComponent);
		component = fixture.componentInstance;

		mockChatService = TestBed.inject(ChatService) as unknown as MockChatService;
		mockChatSocketService = TestBed.inject(ChatSocketService) as unknown as MockChatSocketService;
		mockDialogService = TestBed.inject(DialogService) as unknown as MockDialogService;
		mockAudioService = TestBed.inject(AudioService) as unknown as MockAudioService;
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

	it("should initialize conversations on ngOnInit", () => {
		const mockConversations: Conversation[] = mockConversationListData;
		mockChatService.getConversations.mockReturnValue(of(mockConversations));

		component.ngOnInit();

		expect(mockChatService.getConversations).toHaveBeenCalled();
		expect(component.conversationList).toEqual(mockConversations);
		expect(component.loading).toBe(false);
	});

	it("should call createNewConversation when onNewChat is invoked", () => {
		const mockUsers: User[] = mockUserListData;
		const dialogRefMock = {
			afterClosed$: of(1)
		};
		mockChatService.getUsers.mockReturnValue(of(mockUsers));
		mockDialogService.open.mockReturnValue(dialogRefMock);
		mockChatService.createConversation.mockReturnValue(of(mockConversationData));

		component.onNewChat();

		expect(mockChatService.getUsers).toHaveBeenCalled();
		expect(mockDialogService.open).toHaveBeenCalledWith(expect.anything(), { data: { users: mockUsers } });
		expect(mockRouter.navigate).toHaveBeenCalledWith([91]);
	});

	it("should update conversationList when checkIsRoomWasDeleted is triggered", () => {
		const roomId = 91;
		component.conversationList = mockConversationListData;
		mockChatSocketService.checkIsRoomDeleted.mockReturnValue(of(roomId));

		component["checkIsRoomWasDeleted"]();

		expect(component.conversationList).toEqual([]);
	});

	it("should play notification sound on new last messages", () => {
		const mockResponse = mockConversationData;
		component.conversationList = [];
		mockChatSocketService.checkLastMessages.mockReturnValue(of(mockResponse));

		component["checkNewLastMessages"]();

		expect(mockAudioService.playNotification).toHaveBeenCalled();
		expect(component.conversationList[0]).toMatchObject(mockResponse);
	});

	it("should update user online status when checkOnlineUserStatus is triggered", () => {
		const mockIdList = [1];
		component.conversationList = mockConversationListData;
		mockChatSocketService.checkOnlineUsers.mockReturnValue(of(mockIdList));

		component["checkOnlineUserStatus"]();

		expect(component.conversationList[0].user.isOnline).toBe(true);
	});
});
