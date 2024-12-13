import { Component, NgZone, OnInit } from "@angular/core";
import { faAngleDown, faBars, faMessage, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { ClearObservable } from "@utils/clear-observable";
import { CustomSocketService } from "@core/services/custom-socket/custom-socket.service";
import { User } from "@shared/models/user.model";
import { takeUntil } from "rxjs";
import { UserStoreService } from "@core/services/user-store/user-store.service";
import { TokenStoreService } from "@core/services/token-store/token-store.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.scss"
})
export class HomeComponent extends ClearObservable implements OnInit {
	protected readonly faMessage = faMessage;
	protected readonly faAngleDown = faAngleDown;
	protected readonly faRightFromBracket = faRightFromBracket;
	protected readonly faBars = faBars;

	public isSidePanelActive: boolean = false;
	public menuOpened: boolean = false;
	public user: User | null;

	constructor(
		private router: Router,
		private authService: AuthService,
		private userStoreService: UserStoreService,
		private tokenStoreService: TokenStoreService,
		private socket: CustomSocketService,
		private ngZone: NgZone
	) {
		super();
	}

	public ngOnInit(): void {
		this.authService.userSubject.pipe(takeUntil(this.destroy$)).subscribe(user => {
			this.user = user;
		});
	}

	public logout(): void {
		const user = this.userStoreService.getItem;

		if (!user) return;

		this.authService
			.logout()
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.tokenStoreService.removeItem();
				this.userStoreService.removeItem();

				this.socket.disconnect(user.id);

				this.ngZone.run(() => {
					this.router.navigate(["/auth/login"]);
				});
			});
	}
}
