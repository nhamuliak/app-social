import { Component } from "@angular/core";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: "app-user-avatar",
	templateUrl: "./user-avatar.component.html",
	styleUrl: "./user-avatar.component.scss"
})
export class UserAvatarComponent {
	protected readonly faCloudUpload = faCloudUpload;

	constructor() {}

	public onFileSelected(event: any): void {
		console.log("event: ", event);
	}
}
