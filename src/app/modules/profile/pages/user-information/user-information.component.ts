import { Component, OnInit } from "@angular/core";
import { ClearObservable } from "@utils/clear-observable";
import { FormBuilder, FormGroup } from "@angular/forms";
import { omitBy, isEmpty } from "lodash";
import { ProfileService } from "@modules/profile/services/profile/profile.service";
import { takeUntil } from "rxjs";

@Component({
	templateUrl: "./user-information.component.html",
	styleUrl: "./user-information.component.scss"
})
export class UserInformationComponent extends ClearObservable implements OnInit {
	public form: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private profileService: ProfileService
	) {
		super();
	}

	public ngOnInit(): void {
		this.initForm();
	}

	public onSubmit(): void {
		// omitBy filter out properties with an empty string
		const body = omitBy(this.form.value, isEmpty);

		this.profileService.updateUserInformation(1, body).pipe(takeUntil(this.destroy$)).subscribe();

		this.form.reset();
	}

	private initForm(): void {
		this.form = this.formBuilder.group({
			firstName: [""],
			lastName: [""],
			age: [""]
		});
	}
}
