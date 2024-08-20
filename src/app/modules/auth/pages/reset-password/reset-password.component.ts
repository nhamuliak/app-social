import { Component, OnInit } from "@angular/core";
import { ClearObservable } from "@utils/clear-observable";
import { FormControl, Validators } from "@angular/forms";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { takeUntil } from "rxjs";

@Component({
	templateUrl: "./reset-password.component.html",
	styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent extends ClearObservable implements OnInit {
	public emailCtrl: FormControl = new FormControl("", [Validators.required, Validators.email]);

	constructor(private authService: AuthService) {
		super();
	}

	public ngOnInit(): void {}

	public onReset(): void {
		console.log("email ctrl: ", this.emailCtrl);

		if (this.emailCtrl.valid) {
			const email = this.emailCtrl.value;

			this.authService.resetPassword(email).pipe(takeUntil(this.destroy$)).subscribe();
		}
	}
}
