import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Toast } from "@core/models/toast.models";

@Injectable({
	providedIn: "root"
})
export class ToastService {
	private _messages: Toast[] = [];
	private source = new BehaviorSubject<Toast[]>(this.messages);

	public messageSource(): Observable<Toast[]> {
		return this.source;
	}

	public get messages(): Toast[] {
		return this._messages;
	}

	public addMessage(message: Toast): Toast {
		this._messages.push(message);
		this.source.next(this._messages);

		// TODO:: improve it to delete even when the user clicked on the close icon in UI
		setTimeout(() => {
			this._messages.splice(0, 1);
		}, 2000);

		return message;
	}
}
