import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-manage-account",
	templateUrl: "./manage-account.component.html",
	styleUrl: "./manage-account.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageAccountComponent {}
