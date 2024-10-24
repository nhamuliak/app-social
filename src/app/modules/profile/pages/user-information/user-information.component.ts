import { Component, OnInit } from "@angular/core";
import { ClearObservable } from "@utils/clear-observable";
import { FormBuilder, FormGroup } from "@angular/forms";
import { omitBy, isEmpty } from "lodash";
import { ProfileService } from "@modules/profile/services/profile/profile.service";
import { finalize, takeUntil } from "rxjs";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { User } from "@shared/models/user.model";
import { StoreService } from "@core/services/store/store.service";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "app-user-information",
	templateUrl: "./user-information.component.html",
	styleUrl: "./user-information.component.scss"
})
export class UserInformationComponent extends ClearObservable implements OnInit {
	public loading = false;
	public form: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private profileService: ProfileService,
		private authService: AuthService,
		private storeService: StoreService,
		private toastrService: ToastrService
	) {
		super();
	}

	public ngOnInit(): void {
		this.initForm();
	}

	public onSubmit(): void {
		const { firstName, lastName, age } = this.form.controls;

		if (firstName.value || lastName.value || age.value) {
			this.loading = true;

			const user = this.authService.getUser();

			// omitBy filter out properties with an empty string
			const body = omitBy(this.form.value, isEmpty);

			this.profileService
				.updateUserInformation(user.id, body)
				.pipe(
					finalize(() => (this.loading = false)),
					takeUntil(this.destroy$)
				)
				.subscribe((user: User) => {
					this.storeService.setItem("user", user);

					this.authService.userSubject.next(user);

					this.toastrService.success("The data was updated.");
				});

			this.form.reset();
		}
	}

	private initForm(): void {
		this.form = this.formBuilder.group({
			firstName: [""],
			lastName: [""],
			age: [""]
		});
	}
}
