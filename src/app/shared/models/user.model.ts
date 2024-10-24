export interface User {
	id: number;
	firstName: string;
	lastName: string;
	age: number;
	email: string;
	avatar: string | null;
	isOnline: boolean;
	createdAt: string;
}
