import { Component, OnInit } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faMessage, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { ClearObservable } from "@utils/clear-observable";
import { takeUntil } from "rxjs";
import { StoreService } from "@core/services/store/store.service";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [FaIconComponent, RouterOutlet],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.scss"
})
export class HomeComponent extends ClearObservable implements OnInit {
	public faMessage: IconDefinition = faMessage;
	protected readonly faArrowLeft = faArrowLeft;
	protected readonly faRightFromBracket = faRightFromBracket;

	constructor(
		private router: Router,
		private authService: AuthService,
		private storeService: StoreService
	) {
		super();
	}

	public ngOnInit(): void {}

	public logout(): void {
		this.storeService.removeItem("tokens");
		this.router.navigate(["/auth/login"]);
		// this.authService
		// 	.logout(1)
		// 	.pipe(takeUntil(this.destroy$))
		// 	.subscribe(() => {
		// 		this.storeService.removeItem("tokens");
		// 		this.router.navigate(["/auth/login"]);
		// 	});
	}
}
