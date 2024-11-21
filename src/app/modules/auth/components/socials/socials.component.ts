import { ChangeDetectionStrategy, Component, NgZone, OnInit } from "@angular/core";
import { filter, finalize, switchMap, takeUntil, tap } from "rxjs";
import { FacebookLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { AuthResponse, SocialAuthRequestBody } from "@modules/auth/models/auth.model";
import { ClearObservable } from "@utils/clear-observable";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { Router } from "@angular/router";
import { CustomSocketService } from "@core/services/custom-socket/custom-socket.service";
import { UserStoreService } from "@core/services/user-store/user-store.service";
import { TokenStoreService } from "@core/services/token-store/token-store.service";

@Component({
	selector: "app-socials",
	templateUrl: "./socials.component.html",
	styleUrl: "./socials.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialsComponent extends ClearObservable implements OnInit {
	public loading: boolean = false;

	constructor(
		private router: Router,
		private ngZone: NgZone,
		private socialAuthService: SocialAuthService,
		private authService: AuthService,
		private socket: CustomSocketService,
		private userStoreService: UserStoreService,
		private tokenStoreService: TokenStoreService
	) {
		super();
	}

	public ngOnInit(): void {
		this.handleSocialAuth();
	}

	public onSignInWithFB(): void {
		this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
	}

	private handleSocialAuth(): void {
		this.socialAuthService.authState
			.pipe(
				filter(user => !!user),
				tap(() => (this.loading = true)),
				switchMap((user: SocialUser) => {
					const body: SocialAuthRequestBody = {
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName,
						avatar: user.photoUrl
					};

					return this.authService.socialAuth(body);
				}),
				finalize(() => (this.loading = false)),
				takeUntil(this.destroy$)
			)
			.subscribe((response: AuthResponse): void => {
				this.tokenStoreService.setItem(response.accessToken);
				this.userStoreService.setItem(response.user);

				this.ngZone.run(() => {
					this.router.navigate(["/"]).then(() => {
						this.socialAuthService.signOut(false);
						this.authService.userSubject.next(response.user);
						this.socket.connect();
					});
				});
			});
	}
}
