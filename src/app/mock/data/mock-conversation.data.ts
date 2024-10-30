import { Conversation } from "@modules/chat/models/conversation.model";
import { mockUserData } from "./mock-user.data";

export const mockConversationData: Conversation = {
	id: 1,
	roomId: 91,
	user: mockUserData,
	message: {
		createdAt: new Date().toDateString(),
		id: 1,
		isRead: false,
		text: "test message"
	},
	unreadMessagesCount: 0
};

export const mockConversationListData: Conversation[] = [mockConversationData];
