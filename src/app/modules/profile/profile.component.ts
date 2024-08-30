import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
	templateUrl: "./profile.component.html",
	styleUrl: "./profile.component.scss"
})
export class ProfileComponent {
	constructor(public route: ActivatedRoute) {}
}
