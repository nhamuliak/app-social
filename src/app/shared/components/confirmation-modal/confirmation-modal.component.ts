import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DialogRef } from "@ngneat/dialog";

@Component({
	selector: "app-confirmation-modal",
	standalone: true,
	imports: [],
	templateUrl: "./confirmation-modal.component.html",
	styleUrl: "./confirmation-modal.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationModalComponent {
	public data: { title: string };

	constructor(public ref: DialogRef) {
		this.data = ref.data;
	}
}
