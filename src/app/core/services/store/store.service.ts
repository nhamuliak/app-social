import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class StoreService {
	constructor() {}

	public getItem(key: string): any {
		return localStorage.getItem(key);
	}

	public setItem(key: string, data: any): void {
		console.log("data: ", data);
		localStorage.setItem(key, JSON.stringify(data));
	}

	public removeItem(key: string): void {
		localStorage.removeItem(key);
	}

	public clear(): void {
		localStorage.clear();
	}
}
