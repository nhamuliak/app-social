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
