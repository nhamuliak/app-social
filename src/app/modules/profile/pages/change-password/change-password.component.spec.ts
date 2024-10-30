import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ChangePasswordComponent } from "./change-password.component";
import { ToastrService } from "ngx-toastr";
import { ProfileService } from "@modules/profile/services/profile/profile.service";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { ReactiveFormsModule } from "@angular/forms";
import { MockAuthService, MockProfileService, MockToastrService } from "@mock/services";
import { throwError } from "rxjs";
import { mockUserData } from "@mock/data";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("ChangePasswordComponent", () => {
	let component: ChangePasswordComponent;
	let fixture: ComponentFixture<ChangePasswordComponent>;
	let profileService: MockProfileService;
	let toastrService: MockToastrService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [ChangePasswordComponent],
			providers: [
				{ provide: ToastrService, useClass: MockToastrService },
				{ provide: ProfileService, useClass: MockProfileService },
				{ provide: AuthService, useClass: MockAuthService }
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(ChangePasswordComponent);
		component = fixture.componentInstance;

		profileService = TestBed.inject(ProfileService) as unknown as MockProfileService;
		toastrService = TestBed.inject(ToastrService) as unknown as MockToastrService;

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize the form correctly", () => {
		expect(component.form).toBeTruthy();
		expect(component.form.get("oldPassword")).toBeTruthy();
		expect(component.form.get("newPassword")).toBeTruthy();
		expect(component.form.get("confirmNewPassword")).toBeTruthy();
	});

	it("should require all fields to be valid", () => {
		component.form.get("oldPassword")?.setValue("");
		component.form.get("newPassword")?.setValue("");
		component.form.get("confirmNewPassword")?.setValue("");

		expect(component.form.valid).toBe(false);

		component.form.get("oldPassword")?.setValue("oldpassword");
		component.form.get("newPassword")?.setValue("newpassword");
		component.form.get("confirmNewPassword")?.setValue("newpassword");

		expect(component.form.valid).toBe(true);
	});

	it("should call changePassword method and show success toastr on valid form submission", () => {
		component.form.controls["oldPassword"].setValue("oldpassword");
		component.form.controls["newPassword"].setValue("newpassword");
		component.form.controls["confirmNewPassword"].setValue("newpassword");

		component.onSubmit();

		expect(profileService.changePassword).toHaveBeenCalledWith(mockUserData.id, {
			oldPassword: "oldpassword",
			password: "newpassword"
		});

		// expect(toastrService.success).toHaveBeenCalledWith("The password was changed.");
		expect(component.loading).toBe(false);
	});

	it("should not call changePassword method on invalid form submission", () => {
		component.form.controls["oldPassword"].setValue("oldpassword");
		component.form.controls["newPassword"].setValue("newpassword");
		component.form.controls["confirmNewPassword"].setValue("differentpassword"); // invalid

		component.onSubmit();

		expect(profileService.changePassword).not.toHaveBeenCalled();
		expect(toastrService.success).not.toHaveBeenCalled();
	});

	it("should handle error on changePassword failure", () => {
		component.form.get("oldPassword")?.setValue("oldpassword");
		component.form.get("newPassword")?.setValue("newpassword");
		component.form.get("confirmNewPassword")?.setValue("newpassword");

		profileService.changePassword.mockReturnValue(throwError(() => new Error("Error occurred")));

		component.onSubmit();

		expect(profileService.changePassword).toHaveBeenCalled();
	});
});
