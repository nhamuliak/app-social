import { Message } from "@modules/chat/models/message.model";
import { mockUserData } from "./mock-user.data";
import { PaginationResponse } from "@shared/models";

export const mockMessageData: Message = {
	createdAt: "",
	id: 1,
	isRead: false,
	roomId: 1,
	text: "text",
	user: mockUserData
};

export const mockMessageListData: PaginationResponse<Message> = {
	records: [mockMessageData],
	total: 1
};
