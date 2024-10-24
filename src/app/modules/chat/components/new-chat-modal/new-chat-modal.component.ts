import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DialogRef } from "@ngneat/dialog";

@Component({
	selector: "app-new-chat-modal",
	templateUrl: "./new-chat-modal.component.html",
	styleUrl: "./new-chat-modal.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewChatModalComponent {
	public data: any;

	constructor(public ref: DialogRef) {
		this.data = ref.data;
	}
}
