import { User } from "@shared/models/user.model";

export interface Message {
	createdAt: string;
	id: number;
	isRead: boolean;
	roomId: number;
	text: string;
	user: User;
}
