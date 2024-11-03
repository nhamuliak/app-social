import { Component, OnInit } from "@angular/core";
import { ClearObservable } from "@utils/clear-observable";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { omitBy } from "lodash";
import { ProfileService } from "@modules/profile/services/profile/profile.service";
import { finalize, takeUntil } from "rxjs";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { User } from "@shared/models/user.model";
import { ToastrService } from "ngx-toastr";
import { UserStoreService } from "@core/services/user-store/user-store.service";

@Component({
	selector: "app-user-information",
	templateUrl: "./user-information.component.html",
	styleUrl: "./user-information.component.scss"
})
export class UserInformationComponent extends ClearObservable implements OnInit {
	public loading: boolean = false;
	public form: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private profileService: ProfileService,
		private authService: AuthService,
		private userStoreService: UserStoreService,
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
			const user = this.authService.user;

			if (!user) throw new Error("User does not exist in local storage.");

			this.loading = true;

			const body = omitBy(this.form.value, value => value === "");

			this.profileService
				.updateUserInformation(user.id, body)
				.pipe(
					finalize(() => (this.loading = false)),
					takeUntil(this.destroy$)
				)
				.subscribe((user: User) => {
					this.userStoreService.setItem(user);
					this.authService.userSubject.next(user);

					this.toastrService.success("The data was updated.");
				});
		}
	}

	public get firstNameControl(): FormControl {
		return this.form.get("firstName") as FormControl;
	}

	public get lastNameControl(): FormControl {
		return this.form.get("lastName") as FormControl;
	}

	private initForm(): void {
		const user = this.userStoreService.getItem;

		this.form = this.formBuilder.group({
			firstName: [user?.firstName ?? "", [Validators.required]],
			lastName: [user?.lastName ?? "", [Validators.required]],
			age: [user?.age ?? ""]
		});
	}
}
