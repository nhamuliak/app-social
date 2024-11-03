import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { finalize, takeUntil } from "rxjs";
import { ClearObservable } from "@utils/clear-observable";
import { ApiMessageResponse } from "@modules/auth/models/auth.model";

@Component({
	selector: "app-recovery-password",
	templateUrl: "./recovery-password.component.html",
	styleUrl: "./recovery-password.component.scss"
})
export class RecoveryPasswordComponent extends ClearObservable {
	public loading: boolean = false;
	public emailCtrl: FormControl = new FormControl("", [Validators.required, Validators.email]);

	constructor(
		private authService: AuthService,
		private toastrService: ToastrService
	) {
		super();
	}

	public onReset(): void {
		if (this.emailCtrl.valid) {
			const email = this.emailCtrl.value;

			this.loading = true;

			this.authService
				.recoveryPassword(email)
				.pipe(
					finalize(() => (this.loading = false)),
					takeUntil(this.destroy$)
				)
				.subscribe(({ message }: ApiMessageResponse) => {
					this.toastrService.success(message);
				});
		} else {
			this.emailCtrl.markAsTouched();
			this.emailCtrl.setErrors({ required: true });
		}
	}
}
