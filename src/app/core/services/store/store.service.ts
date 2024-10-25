import { Injectable } from "@angular/core";
import { User } from "@shared/models";

@Injectable({
	providedIn: "root"
})
export class StoreService {
	constructor() {}

	public getItem(key: string): User | null {
		return JSON.parse(localStorage.getItem(key) as any);
	}

	public setItem(key: string, data: unknown): void {
		localStorage.setItem(key, JSON.stringify(data));
	}

	public removeItem(key: string): void {
		localStorage.removeItem(key);
	}

	public clear(): void {
		localStorage.clear();
	}
}
