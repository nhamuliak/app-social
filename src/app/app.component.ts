import { Component } from "@angular/core";
import { faArrowLeft, faMessage, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent {
	public faMessage: IconDefinition = faMessage;
	protected readonly faArrowLeft = faArrowLeft;
	protected readonly faRightFromBracket = faRightFromBracket;
}
