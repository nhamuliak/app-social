import { User } from "@shared/models/user.model";

export interface Conversation {
	id: number;
	roomId: number;
	// userId: number;
	user: User;
	message: {
		createdAt: string;
		id: number;
		isRead: boolean;
		text: string;
	};
	unreadMessagesCount: number;
}
