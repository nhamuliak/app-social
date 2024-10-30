import { Component, NgZone, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { ClearObservable } from "@utils/clear-observable";
import { takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { CustomSocketService } from "@core/services/custom-socket/custom-socket.service";
import { StoreService } from "@core/services/store/store.service";
import { GoogleAuthService } from "@modules/auth/services/google-auth/google-auth.service";

@Component({
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent extends ClearObservable implements OnInit {
	public form: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authService: AuthService,
		private googleAuthService: GoogleAuthService,
		private storeService: StoreService,
		private socket: CustomSocketService,
		private ngZone: NgZone
	) {
		super();
	}

	public ngOnInit(): void {
		// this.googleAuthService.initConfigs();

		this.initForm();
	}

	public onLoginWithGoogle(): void {
		// console.log("google!!!!");
		this.googleAuthService.loginWithGoogle();
	}

	public onLogin(): void {
		if (this.form.valid) {
			this.authService
				.login(this.form.value)
				.pipe(takeUntil(this.destroy$))
				.subscribe(tokens => {
					// console.log("login data: ", tokens);
					// store tokens
					this.authService.setToken(tokens.accessToken);

					this.storeService.setItem("user", this.authService.getUser());

					this.ngZone.run(() => {
						this.router.navigate(["/"]).then(() => {
							this.socket.connect();
						});
					});
				});
		}
	}

	private initForm(): void {
		this.form = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", Validators.required]
		});
	}
}
