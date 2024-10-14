import { Component } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown, faMessage, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { ClearObservable } from "@utils/clear-observable";
import { StoreService } from "@core/services/store/store.service";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [FaIconComponent, RouterOutlet],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.scss"
})
export class HomeComponent extends ClearObservable {
	public faMessage: IconDefinition = faMessage;
	protected readonly faAngleDown = faAngleDown;
	protected readonly faRightFromBracket = faRightFromBracket;
	public menuOpened: boolean = false;

	constructor(
		private router: Router,
		private authService: AuthService,
		private storeService: StoreService
	) {
		super();
	}

	public logout(): void {
		this.storeService.removeItem("access_token");
		this.router.navigate(["/auth/login"]);
		// this.authService
		// 	.logout(1)
		// 	.pipe(takeUntil(this.destroy$))
		// 	.subscribe(() => {
		// 		this.storeService.removeItem("access_token");
		// 		this.router.navigate(["/auth/login"]);
		// 	});
	}
}
