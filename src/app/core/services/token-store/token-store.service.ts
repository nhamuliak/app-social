import { Injectable } from "@angular/core";
import { TOKEN_STORE_KEY } from "@utils/consts";

@Injectable({
	providedIn: "root"
})
export class TokenStoreService {
	private readonly key: string = TOKEN_STORE_KEY;

	public get getItem(): string {
		return localStorage.getItem(this.key) as string;
	}

	public setItem(token: string): void {
		localStorage.setItem(this.key, token);
	}

	public removeItem(): void {
		localStorage.removeItem(this.key);
	}
}
