import { Component, OnInit } from "@angular/core";
import { ClearObservable } from "@utils/clear-observable";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProfileService } from "@modules/profile/services/profile/profile.service";
import { ToastrService } from "ngx-toastr";
import { finalize, takeUntil } from "rxjs";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { passwordMatchValidator } from "@utils/validators";

@Component({
	selector: "app-change-password",
	templateUrl: "./change-password.component.html",
	styleUrl: "./change-password.component.scss"
})
export class ChangePasswordComponent extends ClearObservable implements OnInit {
	public loading = false;
	public form: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private profileService: ProfileService,
		private toastrService: ToastrService
	) {
		super();
	}

	public ngOnInit(): void {
		this.initForm();
	}

	public onSubmit(): void {
		if (this.form.valid) {
			this.loading = true;
			const user = this.authService.getUser();

			const { oldPassword, newPassword } = this.form.value;

			this.profileService
				.changePassword(user.id, { oldPassword, password: newPassword })
				.pipe(
					finalize(() => (this.loading = false)),
					takeUntil(this.destroy$)
				)
				.subscribe(() => {
					this.toastrService.success("The password was changed.");
				});
		}
	}

	private initForm(): void {
		this.form = this.formBuilder.group(
			{
				oldPassword: ["", Validators.required],
				newPassword: ["", Validators.required],
				confirmNewPassword: ["", Validators.required]
			},
			{
				validators: passwordMatchValidator("newPassword", "confirmNewPassword")
			}
		);
	}
}
