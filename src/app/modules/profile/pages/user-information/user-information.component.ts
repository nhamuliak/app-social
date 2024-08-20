import { Component, OnInit } from "@angular/core";
import { ClearObservable } from "@utils/clear-observable";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	templateUrl: "./user-information.component.html",
	styleUrl: "./user-information.component.scss"
})
export class UserInformationComponent extends ClearObservable implements OnInit {
	public form: FormGroup;

	constructor(private formBuilder: FormBuilder) {
		super();
	}

	public ngOnInit(): void {
		this.initForm();
	}

	private initForm(): void {
		this.form = this.formBuilder.group({
			firstName: ["", Validators.required],
			lastName: ["", Validators.required],
			age: ["", Validators.required]
		});
	}
}
