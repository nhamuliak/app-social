import { Component, NgZone, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { ClearObservable } from "@utils/clear-observable";
import { takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { CustomSocketService } from "@core/services/custom-socket/custom-socket.service";
import { markAllAsRequired } from "@utils/validators";
import { UserStoreService } from "@core/services/user-store/user-store.service";
import { TokenStoreService } from "@core/services/token-store/token-store.service";
import { AuthResponse } from "@modules/auth/models/auth.model";

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
		private socket: CustomSocketService,
		private ngZone: NgZone,
		private userStoreService: UserStoreService,
		private tokenStoreService: TokenStoreService
	) {
		super();
	}

	public ngOnInit(): void {
		this.initForm();
	}

	public onLogin(): void {
		if (this.form.valid) {
			this.authService
				.login(this.form.value)
				.pipe(takeUntil(this.destroy$))
				.subscribe((response: AuthResponse) => {
					this.tokenStoreService.setItem(response.accessToken);
					this.userStoreService.setItem(response.user);

					this.socket.ioSocket.io.opts.extraHeaders = {
						Authorization: response.accessToken
					};

					this.ngZone.run(() => {
						this.router.navigate(["/"]).then(() => {
							this.authService.userSubject.next(response.user);
							this.socket.connect();
						});
					});
				});
		} else {
			markAllAsRequired(this.form);
		}
	}

	private initForm(): void {
		this.form = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", Validators.required]
		});
	}

	public get emailControl(): FormControl {
		return this.form.controls["email"] as FormControl;
	}

	public get passwordControl(): FormControl {
		return this.form.controls["password"] as FormControl;
	}
}
