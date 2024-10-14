import { User } from "@modules/chat/models/user.models";

export interface RegisterRequestBody {
	username: string;
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
