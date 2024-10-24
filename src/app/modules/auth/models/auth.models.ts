import { User } from "@shared/models/user.model";

type Gender = "male" | "female";

export interface RegisterRequestBody {
	firstName: string;
	lastName: string;
	age: number | null;
	email: string;
	password: string;
	confirmTerms: boolean;
	gender?: Gender;
}

export interface LoginRequestBody {
	email: string;
	password: string;
}

export interface Payload extends User {
	exp: number;
	iat: number;
}
