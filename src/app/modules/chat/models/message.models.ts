import { User } from "@shared/models/user.model";

export interface Message {
	createdAt: string;
	id: number;
	isRead: boolean;
	roomId: number;
	text: string;
	userId: number;
	user: User;
}

// interface MessageUser {
// 	// acceptTerms: boolean;
// 	age: number;
// 	avatar: string;
// 	createdAt: string;
// 	email: string;
// 	firstName: string;
// 	id: number;
// 	isOnline: boolean;
// 	lastName: string;
// }
