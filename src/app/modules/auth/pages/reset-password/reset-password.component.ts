import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ClearObservable } from "@utils/clear-observable";
import { FormControl, Validators } from "@angular/forms";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { finalize, takeUntil } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { ApiMessageResponse } from "@modules/auth/models/auth.model";

@Component({
	templateUrl: "./reset-password.component.html",
	styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent extends ClearObservable {
	public loading = false;
	public passwordCtrl: FormControl = new FormControl("", [Validators.required, Validators.minLength(5)]);

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authService: AuthService,
		private toastrService: ToastrService
	) {
		super();
	}

	public onReset(): void {
		if (this.passwordCtrl.valid) {
			const password = this.passwordCtrl.value;
			const token = this.route.snapshot.queryParams["token"];

			this.loading = true;

			this.authService
				.resetPassword(token, password)
				.pipe(
					finalize(() => (this.loading = false)),
					takeUntil(this.destroy$)
				)
				.subscribe(({ message }: ApiMessageResponse) => {
					this.router.navigate(["/auth/login"]).then(() => {
						this.toastrService.success(message);
					});
				});
		} else {
			this.passwordCtrl.markAsTouched();
			this.passwordCtrl.setErrors({ required: true });
		}
	}
}
