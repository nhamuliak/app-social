import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root"
})
export class ChatService {
	constructor(private _http: HttpClient) {}

	public getChatList(): Observable<unknown[]> {
		const data = new Array(40).fill("").map((_, index) => index + 1);

		return of(data).pipe(delay(500));
	}
}
