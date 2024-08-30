import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class StoreService {
	constructor() {
		// do nothing.
	}

	public getItem(key: string): unknown {
		return localStorage.getItem(key);
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
