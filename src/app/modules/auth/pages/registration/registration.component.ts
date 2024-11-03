import { Component, NgZone, OnInit } from "@angular/core";
import { ClearObservable } from "@utils/clear-observable";
import { Router } from "@angular/router";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs";
import { markAllAsRequired } from "@utils/validators";

@Component({
	templateUrl: "./registration.component.html",
	styleUrls: ["./registration.component.scss"]
})
export class RegistrationComponent extends ClearObservable implements OnInit {
	public form: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authService: AuthService,
		private ngZone: NgZone
	) {
		super();
	}

	public ngOnInit(): void {
		this.initForm();
	}

	public onRegister(): void {
		if (this.form.valid) {
			this.authService
				.registration(this.form.value)
				.pipe(takeUntil(this.destroy$))
				.subscribe(() => {
					this.ngZone.run(() => {
						this.router.navigate(["/auth/login"]);
					});
				});
		} else {
			markAllAsRequired(this.form);
		}
	}

	public get firstNameControl(): FormControl {
		return this.form.get("firstName") as FormControl;
	}

	public get lastNameControl(): FormControl {
		return this.form.get("lastName") as FormControl;
	}

	public get emailControl(): FormControl {
		return this.form.get("email") as FormControl;
	}

	public get passwordControl(): FormControl {
		return this.form.get("password") as FormControl;
	}

	public get confirmPasswordControl(): FormControl {
		return this.form.get("confirmPassword") as FormControl;
	}

	public get acceptTermsControl(): FormControl {
		return this.form.get("acceptTerms") as FormControl;
	}

	private initForm(): void {
		this.form = this.formBuilder.group({
			firstName: new FormControl("", [Validators.required]),
			lastName: new FormControl("", [Validators.required]),
			age: new FormControl("", []),
			email: new FormControl("", [Validators.required]),
			password: new FormControl("", [Validators.required]),
			confirmPassword: new FormControl("", [Validators.required]),
			acceptTerms: new FormControl(false, [Validators.required])
		});
	}
}
