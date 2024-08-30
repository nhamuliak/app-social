import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root"
})
export class ProfileService {
	private readonly urlPath = "http://localhost:3000/api";

	constructor(private http: HttpClient) {}

	public updateUserInformation(userId: number, data: unknown): Observable<unknown> {
		return this.updateUserProfile(userId, data);
	}

	public updateUserAvatar(userId: number, data: unknown): Observable<unknown> {
		return this.updateUserProfile(userId, data);
	}

	public changePassword(userId: number, data: unknown): Observable<unknown> {
		return this.updateUserProfile(userId, data);
	}

	private updateUserProfile(userId: number, data: unknown): Observable<unknown> {
		return this.http.patch<unknown>(`${this.urlPath}/user/${userId}`, { data });
	}
}
