import { Component, OnInit } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown, faMessage, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Router, RouterOutlet } from "@angular/router";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { ClearObservable } from "@utils/clear-observable";
import { StoreService } from "@core/services/store/store.service";
import { CustomSocketService } from "@core/services/custom-socket/custom-socket.service";
import { User } from "@shared/models/user.model";
import { AvatarComponent } from "@shared/components/avatar/avatar.component";
import { takeUntil } from "rxjs";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [FaIconComponent, RouterOutlet, AvatarComponent],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.scss"
})
export class HomeComponent extends ClearObservable implements OnInit {
	public faMessage: IconDefinition = faMessage;
	protected readonly faAngleDown = faAngleDown;
	protected readonly faRightFromBracket = faRightFromBracket;
	public menuOpened = false;
	public user: User;

	constructor(
		private router: Router,
		private authService: AuthService,
		private storeService: StoreService,
		private socket: CustomSocketService
	) {
		super();
	}

	ngOnInit() {
		this.authService.userSubject.pipe(takeUntil(this.destroy$)).subscribe(user => {
			this.user = user;
		});
	}

	public logout(): void {
		this.storeService.removeItem("access_token");
		this.router.navigate(["/auth/login"]);
		this.socket.disconnect(this.user?.id);

		// this.authService
		// 	.logout(1)
		// 	.pipe(takeUntil(this.destroy$))
		// 	.subscribe(() => {
		// 		this.storeService.removeItem("access_token");
		// 		this.router.navigate(["/auth/login"]);
		// 	});
	}
}
