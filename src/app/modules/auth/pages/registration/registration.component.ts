import { Component, OnInit } from "@angular/core";
import { ClearObservable } from "@utils/clear-observable";
import { Router } from "@angular/router";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs";

@Component({
	templateUrl: "./registration.component.html",
	styleUrls: ["./registration.component.scss"]
})
export class RegistrationComponent extends ClearObservable implements OnInit {
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

	public onRegister(): void {
		if (this.form.valid) {
			this.authService.registration(this.form.value).pipe(takeUntil(this.destroy$));
			// .subscribe(() => {
			// 	this.router.navigate(["/auth/login"]);
			// });
		}
	}

	private initForm(): void {
		this.form = this.formBuilder.group({
			name: new FormControl("", [Validators.required]),
			age: new FormControl("", []),
			email: new FormControl("", [Validators.required]),
			password: new FormControl("", [Validators.required]),
			confirmPassword: new FormControl("", [Validators.required]),
			acceptTerms: new FormControl(false, [Validators.required])
		});
	}
}
