import { Component } from "@angular/core";
import { ClearObservable } from "@utils/clear-observable";
import { FormControl, Validators } from "@angular/forms";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { takeUntil } from "rxjs";

@Component({
	templateUrl: "./reset-password.component.html",
	styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent extends ClearObservable {
	public emailCtrl: FormControl = new FormControl("", [Validators.required, Validators.email]);

	constructor(private authService: AuthService) {
		super();
	}

	public onReset(): void {
		if (this.emailCtrl.valid) {
			const email = this.emailCtrl.value;

			this.authService.resetPassword(email).pipe(takeUntil(this.destroy$)).subscribe();
		}
	}
}
