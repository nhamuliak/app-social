import { User } from "@shared/models/user.model";

export interface AuthResponse {
	accessToken: string;
	user: User;
}

export interface ApiMessageResponse {
	message: string;
}

export interface Tokens {
	accessToken: string;
	refreshToken: string;
}

export interface SocialAuthRequestBody {
	firstName: string;
	lastName: string;
	email: string;
	avatar: string;
}

export interface RegisterRequestBody {
	firstName: string;
	lastName: string;
	age: number | null;
	email: string;
	password: string;
	confirmTerms: boolean;
}

export interface LoginRequestBody {
	email: string;
	password: string;
}

export interface Payload extends User {
	exp: number;
	iat: number;
}
