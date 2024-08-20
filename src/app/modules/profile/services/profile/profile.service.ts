import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root"
})
export class ProfileService {
	private readonly urlPath = "http://localhost:3000/api";

	constructor(private http: HttpClient) {}

	public updateUserInformation(userId: number, data: any): Observable<any> {
		return this.updateUserProfile(userId, data);
	}

	public updateUserAvatar(userId: number, data: any): Observable<any> {
		return this.updateUserProfile(userId, data);
	}

	public changePassword(userId: number, data: any): Observable<any> {
		return this.updateUserProfile(userId, data);
	}

	private updateUserProfile(userId: number, data: any): Observable<any> {
		return this.http.patch<any>(`${this.urlPath}/user/${userId}`, { data });
	}
}
