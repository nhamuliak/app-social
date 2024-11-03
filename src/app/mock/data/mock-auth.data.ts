import { LoginRequestBody, Payload, RegisterRequestBody } from "@modules/auth/models/auth.model";
import { mockUserData } from "@mock/data/mock-user.data";

export const mockRegisterData: RegisterRequestBody = {
	firstName: "Test",
	lastName: "User",
	age: 18,
	email: "test@gmail.com",
	password: "secret12345",
	confirmTerms: true
};

export const mockSocialRequestData = {
	firstName: "Test",
	lastName: "User",
	email: "test@gmail.com",
	photoUrl: "avatar_url"
};

export const mockSocialData = {
	firstName: "Test",
	lastName: "User",
	email: "test@gmail.com",
	avatar: "avatar_url"
};

export const mockLoginData: LoginRequestBody = {
	email: "test@gmail.com",
	password: "secret12345"
};

export const mockPayloadData: Payload = {
	...mockUserData,
	exp: new Date().getTime() + 1,
	iat: new Date().getTime() + 1
};
