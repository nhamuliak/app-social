import { Injectable } from "@angular/core";
import { User } from "@shared/models";
import { USER_STORE_KEY } from "@utils/consts";

@Injectable({
	providedIn: "root"
})
export class UserStoreService {
	private readonly key: string = USER_STORE_KEY;

	public get getItem(): User | null {
		return JSON.parse(localStorage.getItem(this.key) as string);
	}

	public setItem(user: User): void {
		localStorage.setItem(this.key, JSON.stringify(user));
	}

	public removeItem(): void {
		localStorage.removeItem(this.key);
	}
}
