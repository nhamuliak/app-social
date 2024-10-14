import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { ClearObservable } from "@utils/clear-observable";
import { takeUntil } from "rxjs";
import { Router } from "@angular/router";

@Component({
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent extends ClearObservable implements OnInit {
	public form: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authService: AuthService
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
				.subscribe(tokens => {
					console.log("login data: ", tokens);
					// store tokens
					// this.storeService.setItem("tokens", response);
					this.authService.setToken(tokens.accessToken);
					// this.authService.setUser(user);

					this.router.navigate(["/"]);
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
