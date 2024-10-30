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
import { ClickOutsideDirective } from "@shared/directives/click-outside/click-outside.directive";

@Component({
	selector: "app-home",
	standalone: true,
	imports: [FaIconComponent, RouterOutlet, AvatarComponent, ClickOutsideDirective],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.scss"
})
export class HomeComponent extends ClearObservable implements OnInit {
	public faMessage: IconDefinition = faMessage;
	protected readonly faAngleDown = faAngleDown;
	protected readonly faRightFromBracket = faRightFromBracket;
	public menuOpened = false;
	public user: User | null;

	constructor(
		private router: Router,
		private authService: AuthService,
		private storeService: StoreService,
		private socket: CustomSocketService
	) {
		super();
	}

	public ngOnInit(): void {
		this.authService.userSubject.pipe(takeUntil(this.destroy$)).subscribe(user => {
			this.user = user;
		});
	}

	public logout(): void {
		const user = this.authService.getUser();

		this.authService
			.logout()
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.storeService.removeItem("access_token");
				this.socket.disconnect(user.id);
				this.router.navigate(["/auth/login"]);
			});
	}
}
