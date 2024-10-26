import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserInformationComponent } from "./user-information.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ProfileService } from "@modules/profile/services/profile/profile.service";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { StoreService } from "@core/services/store/store.service";
import { MockAuthService, MockProfileService, MockStoreService, MockToastrService } from "@mock/services";
import { of } from "rxjs";

describe("UserInformationComponent", () => {
	let component: UserInformationComponent;
	let fixture: ComponentFixture<UserInformationComponent>;
	let profileService: MockProfileService;
	let toastrService: MockToastrService;
	let authService: MockAuthService;
	let storeService: MockStoreService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [UserInformationComponent],
			providers: [
				{ provide: ToastrService, useValue: MockToastrService },
				{ provide: ProfileService, useValue: MockProfileService },
				{ provide: AuthService, useValue: MockAuthService },
				{ provide: StoreService, useValue: MockStoreService }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(UserInformationComponent);
		component = fixture.componentInstance;

		profileService = new MockProfileService();
		toastrService = new MockToastrService();
		authService = new MockAuthService();
		storeService = new MockStoreService();

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize the form", () => {
		component.ngOnInit();
		expect(component.form).toBeTruthy();
		expect(component.form.controls["firstName"].value).toBe("");
		expect(component.form.controls["lastName"].value).toBe("");
		expect(component.form.controls["age"].value).toBe("");
	});

	it("should submit the form and call updateUserInformation", () => {
		const user = { id: "123" };
		authService.getUser.mockReturnValue(user);
		profileService.updateUserInformation.mockReturnValue(of(user)); // mock successful response

		component.form.controls["firstName"].setValue("John");
		component.form.controls["lastName"].setValue("Doe");
		component.form.controls["age"].setValue(30);
		component.onSubmit();

		expect(profileService.updateUserInformation).toHaveBeenCalledWith(user.id, {
			firstName: "John",
			lastName: "Doe",
			age: 30
		});
		expect(storeService.setItem).toHaveBeenCalledWith("user", user);
		expect(authService.userSubject.next).toHaveBeenCalledWith(user);
		expect(toastrService.success).toHaveBeenCalledWith("The data was updated.");
		expect(component.loading).toBe(false); // loading should be set to false after submission
		expect(component.form.controls["firstName"].value).toBe("");
		expect(component.form.controls["lastName"].value).toBe("");
		expect(component.form.controls["age"].value).toBe(""); // form should be reset
	});

	it("should not submit if the form is empty", () => {
		component.onSubmit();
		expect(profileService.updateUserInformation).not.toHaveBeenCalled();
		expect(toastrService.success).not.toHaveBeenCalled();
	});

	it("should omit empty fields when submitting", () => {
		const user = { id: "123" };
		authService.getUser.mockReturnValue(user);
		profileService.updateUserInformation.mockReturnValue(of(user)); // mock successful response

		component.form.controls["firstName"].setValue("");
		component.form.controls["lastName"].setValue("Doe");
		component.form.controls["age"].setValue("");

		component.onSubmit();

		expect(profileService.updateUserInformation).toHaveBeenCalledWith(user.id, {
			lastName: "Doe"
		});
	});
});
