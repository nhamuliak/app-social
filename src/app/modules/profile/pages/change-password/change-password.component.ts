import { Component, OnInit } from "@angular/core";
import { ClearObservable } from "@utils/clear-observable";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	templateUrl: "./change-password.component.html",
	styleUrl: "./change-password.component.scss"
})
export class ChangePasswordComponent extends ClearObservable implements OnInit {
	public form: FormGroup;

	constructor(private formBuilder: FormBuilder) {
		super();
	}

	public ngOnInit(): void {
		this.initForm();
	}

	private initForm(): void {
		this.form = this.formBuilder.group({
			oldPassword: ["", Validators.required],
			newPassword: ["", Validators.required],
			confirmNewPassword: ["", Validators.required]
		});
	}
}
