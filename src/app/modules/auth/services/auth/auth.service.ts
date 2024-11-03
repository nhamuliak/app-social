import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
	LoginRequestBody,
	RegisterRequestBody,
	SocialAuthRequestBody,
	AuthResponse
} from "@modules/auth/models/auth.model";
import { jwtDecode } from "jwt-decode";
import { User } from "@shared/models/user.model";
import { environment } from "@environments/environment";
import { UserStoreService } from "@core/services/user-store/user-store.service";
import { TokenStoreService } from "@core/services/token-store/token-store.service";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	private readonly urlPath = `${environment.apiUrl}/auth`;

	public userSubject: BehaviorSubject<User | null>;

	constructor(
		private http: HttpClient,
		private userStoreService: UserStoreService,
		private tokenStoreService: TokenStoreService
	) {
		this.userSubject = new BehaviorSubject<User | null>(this.userStoreService.getItem);
	}

	public get user(): User | null {
		return this.userSubject.value;
	}

	public registration(body: RegisterRequestBody): Observable<unknown> {
		return this.http.post<Observable<unknown>>(`${this.urlPath}/registration`, body);
	}

	public login(body: LoginRequestBody): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${this.urlPath}/login`, body, { withCredentials: true });
	}

	public socialAuth(body: SocialAuthRequestBody): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${this.urlPath}/social-auth`, body);
	}

	public recoveryPassword(email: string): Observable<{ title: string }> {
		return this.http.post<{ title: string }>(`${this.urlPath}/recover-password`, { email });
	}

	public resetPassword(token: string, password: string): Observable<{ title: string }> {
		return this.http.post<{ title: string }>(`${this.urlPath}/reset-password`, { token, password });
	}

	public logout(): Observable<void> {
		return this.http.post<void>(`${this.urlPath}/logout`, {});
	}

	public refresh(): Observable<{ accessToken: string }> {
		return this.http.post<{ accessToken: string }>(`${this.urlPath}/refresh`, {}, { withCredentials: true });
	}

	public isAuthenticated(): boolean {
		const token = this.tokenStoreService.getItem;

		if (token) {
			return jwtDecode(token);
		}

		return false;
	}
}
