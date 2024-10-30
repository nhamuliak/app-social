import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DialogRef } from "@ngneat/dialog";
import { User } from "@shared/models";

@Component({
	selector: "app-new-chat-modal",
	templateUrl: "./new-chat-modal.component.html",
	styleUrl: "./new-chat-modal.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewChatModalComponent {
	public data: { users: User[] };

	constructor(public ref: DialogRef) {
		this.data = ref.data;
	}
}
