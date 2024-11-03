import { Component, OnInit } from "@angular/core";
import { ClearObservable } from "@utils/clear-observable";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ProfileService } from "@modules/profile/services/profile/profile.service";
import { ToastrService } from "ngx-toastr";
import { finalize, takeUntil } from "rxjs";
import { markAllAsRequired, passwordMatchValidator } from "@utils/validators";
import { UserStoreService } from "@core/services/user-store/user-store.service";

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
		private profileService: ProfileService,
		private toastrService: ToastrService,
		private userStoreService: UserStoreService
	) {
		super();
	}

	public ngOnInit(): void {
		this.initForm();
	}

	public onSubmit(): void {
		if (this.form.valid) {
			this.loading = true;
			const user = this.userStoreService.getItem;

			if (!user) throw new Error("User does not exist in local storage.");

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
		} else {
			markAllAsRequired(this.form);
		}
	}

	public get oldPasswordControl(): FormControl {
		return this.form.get("oldPassword") as FormControl;
	}

	public get newPasswordControl(): FormControl {
		return this.form.get("newPassword") as FormControl;
	}

	public get confirmNewPasswordControl(): FormControl {
		return this.form.get("confirmNewPassword") as FormControl;
	}

	private initForm(): void {
		this.form = this.formBuilder.group(
			{
				oldPassword: ["", [Validators.required, Validators.minLength(5)]],
				newPassword: ["", [Validators.required, Validators.minLength(5)]],
				confirmNewPassword: ["", [Validators.required, Validators.minLength(5)]]
			},
			{
				validators: passwordMatchValidator("newPassword", "confirmNewPassword")
			}
		);
	}
}
