import { User } from "@modules/chat/models/user.models";

export interface Conversation {
	id: number;
	roomId: number;
	userId: number;
	user: User;
	message: {
		createdAt: string;
		id: number;
		isRead: boolean;
		text: string;
	};
}
