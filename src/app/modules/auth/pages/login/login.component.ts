import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
	public form: FormGroup;

	constructor(private formBuilder: FormBuilder) {}

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			email: ["", Validators.required],
			password: ["", Validators.required]
		});
	}

	public onLogin(): void {
		console.info("form: ", this.form);
	}
}
