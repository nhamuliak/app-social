export interface User {
	id: number;
	firstName: string;
	lastName: string;
	age: number;
	email: string;
	// "password": string;
	avatar: string;
	acceptTerms: boolean;
	isOnline: boolean;
	createdAt: string;
}

export interface PaginationResponse<T = any> {
	records: T;
	page: number;
}
