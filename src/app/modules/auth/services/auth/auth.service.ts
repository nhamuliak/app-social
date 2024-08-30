import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoginRequestBody, RegisterRequestBody } from "@modules/auth/models/auth.models";

@Injectable({
	providedIn: "root"
})
export class AuthService {
	private readonly urlPath = "http://localhost:3000/api";

	constructor(private http: HttpClient) {}

	public registration(body: RegisterRequestBody): Observable<unknown> {
		return this.http.post<Observable<unknown>>(`${this.urlPath}/auth/registration`, body);
	}

	public login(body: LoginRequestBody): Observable<unknown> {
		return this.http.post<Observable<unknown>>(`${this.urlPath}/auth/login`, body);
	}

	public resetPassword(email: string): Observable<unknown> {
		return this.http.post<Observable<unknown>>(`${this.urlPath}/auth/reset-password`, { email });
	}

	public logout(userId: number): Observable<unknown> {
		return this.http.post<Observable<unknown>>(`${this.urlPath}/auth/logout`, { userId });
	}

	public getAuthToken(): string {
		return "skdjsaldjasd78sdujksad656ad56saydghjk";
	}
}
