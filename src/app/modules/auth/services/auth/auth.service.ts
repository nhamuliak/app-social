import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoginRequestBody, Payload, RegisterRequestBody, Token } from "@modules/auth/models/auth.model";
import { jwtDecode } from "jwt-decode";
import { User } from "@shared/models/user.model";
import { StoreService } from "@core/services/store/store.service";
import { environment } from "@environments/environment";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	private readonly urlPath = `${environment.apiUrl}/auth`;

	public userSubject: BehaviorSubject<User | null>;

	constructor(
		private http: HttpClient,
		private storeService: StoreService
	) {
		this.userSubject = new BehaviorSubject<User | null>(this.storeService.getItem("user"));
	}

	public get user(): User | null {
		return this.userSubject.value;
	}

	public registration(body: RegisterRequestBody): Observable<unknown> {
		return this.http.post<Observable<unknown>>(`${this.urlPath}/registration`, body);
	}

	public login(body: LoginRequestBody): Observable<Token> {
		return this.http.post<Token>(`${this.urlPath}/login`, body);
	}

	public resetPassword(email: string): Observable<unknown> {
		return this.http.post<Observable<unknown>>(`${this.urlPath}/reset-password`, { email });
	}

	public logout(): Observable<unknown> {
		return this.http.post<Observable<unknown>>(`${this.urlPath}/logout`, {});
	}

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

		if (token) {
			return jwtDecode(token);
		}

		return false;
	}
}
