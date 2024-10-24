import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "@shared/models/user.model";
import { UpdateInfo, UpdatePassword } from "@modules/profile/models/profile.model";
import { environment } from "@environments/environment";

@Injectable({
	providedIn: "root"
})
export class ProfileService {
	private readonly urlPath = `${environment.apiUrl}/user`;

	constructor(private http: HttpClient) {}

	public updateUserInformation(userId: number, data: Partial<UpdateInfo>): Observable<User> {
		return this.http.patch<User>(`${this.urlPath}/${userId}`, data);
	}

	public updateUserAvatar(userId: number, file: File): Observable<User> {
		const formData: FormData = new FormData();

		formData.append("file", file, file.name);

		return this.http.patch<User>(`${this.urlPath}/${userId}`, formData);
	}

	public changePassword(userId: number, data: UpdatePassword): Observable<User> {
		return this.http.patch<User>(`${this.urlPath}/${userId}`, data);
	}
}
