import { User } from "@shared/models";

export const mockUserData: User = {
	id: 1,
	firstName: "User",
	lastName: "Test",
	age: 21,
	email: "user@example.com",
	avatar: "",
	isOnline: false,
	createdAt: new Date().toDateString()
};

export const mockUserListData: User[] = [mockUserData];
