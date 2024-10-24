import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoginRequestBody, Payload, RegisterRequestBody } from "@modules/auth/models/auth.models";
import { jwtDecode } from "jwt-decode";
import { User } from "@shared/models/user.model";
import { StoreService } from "@core/services/store/store.service";

interface Token {
	accessToken: string;
	refreshToken: string;
}

@Injectable({
	providedIn: "root"
})
export class AuthService {
	private readonly urlPath = "http://localhost:3000/api";

	public userSubject: BehaviorSubject<User>;

	constructor(
		private http: HttpClient,
		private storeService: StoreService
	) {
		this.userSubject = new BehaviorSubject<User>(this.storeService.getItem("user") as User);
	}

	public get user(): User {
		return this.userSubject.value;
	}

	public registration(body: RegisterRequestBody): Observable<unknown> {
		return this.http.post<Observable<unknown>>(`${this.urlPath}/auth/registration`, body);
	}

	public login(body: LoginRequestBody): Observable<Token> {
		return this.http.post<Token>(`${this.urlPath}/auth/login`, body);
	}

	public resetPassword(email: string): Observable<unknown> {
		return this.http.post<Observable<unknown>>(`${this.urlPath}/auth/reset-password`, { email });
	}

	public logout(userId: number): Observable<unknown> {
		return this.http.post<Observable<unknown>>(`${this.urlPath}/auth/logout`, { userId });
	}

	// public getToken(): string | null {
	// 	return localStorage.getItem("access_token");
	// }

	public getAuthToken(): string | null {
		return localStorage.getItem("access_token");
	}

	public setToken(token: string): void {
		localStorage.setItem("access_token", token);
	}

	public getUser(): Payload {
		const token = localStorage.getItem("access_token");

		if (token) {
			return jwtDecode(token);
		}

		throw new Error("Unauthorized");
	}

	public isAuthenticated(): boolean {
		const token = localStorage.getItem("access_token");

		if (token && this.isTokenValidStructure(token)) {
			return true;
		}

		return false;
	}

	private isTokenExpired(token: string): boolean {
		const decoded: any = jwtDecode(token);
		const currentTime = Math.floor(Date.now() / 1000);

		return decoded.exp < currentTime;
	}

	private isTokenValidStructure(token: string): boolean {
		const parts = token.split(".");

		return parts.length === 3;
	}
}
