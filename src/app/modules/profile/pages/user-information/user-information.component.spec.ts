import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserInformationComponent } from "./user-information.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ProfileService } from "@modules/profile/services/profile/profile.service";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { MockAuthService, MockProfileService, MockStoreService, MockToastrService } from "@mock/services";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { UserStoreService } from "@core/services/user-store/user-store.service";
import { mockUserData } from "@mock/data";

describe("UserInformationComponent", () => {
	let component: UserInformationComponent;
	let fixture: ComponentFixture<UserInformationComponent>;
	let profileService: MockProfileService;
	let toastrService: MockToastrService;
	let mockUserStoreService: MockStoreService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReactiveFormsModule],
			declarations: [UserInformationComponent],
			providers: [
				{ provide: ToastrService, useClass: MockToastrService },
				{ provide: ProfileService, useClass: MockProfileService },
				{ provide: AuthService, useClass: MockAuthService },
				{ provide: UserStoreService, useClass: MockStoreService }
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(UserInformationComponent);
		component = fixture.componentInstance;

		profileService = TestBed.inject(ProfileService) as unknown as MockProfileService;
		toastrService = TestBed.inject(ToastrService) as unknown as MockToastrService;
		mockUserStoreService = TestBed.inject(UserStoreService) as unknown as MockStoreService;

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize the form", () => {
		jest.spyOn(mockUserStoreService, "getItem", "get").mockReturnValue(null);

		component.ngOnInit();
		expect(component.form).toBeTruthy();
		expect(component.form.controls["firstName"].value).toBe("");
		expect(component.form.controls["lastName"].value).toBe("");
		expect(component.form.controls["age"].value).toBe("");
	});

	it("should not submit if the form is empty", () => {
		component.form.controls["firstName"].setValue("");
		component.form.controls["lastName"].setValue("");
		component.form.controls["age"].setValue("");

		component.onSubmit();
		expect(profileService.updateUserInformation).not.toHaveBeenCalled();
		expect(toastrService.success).not.toHaveBeenCalled();
	});

	it("should omit empty fields when submitting", () => {
		const user = mockUserData;

		component.form.controls["firstName"].setValue("");
		component.form.controls["lastName"].setValue("Doe");
		component.form.controls["age"].setValue("");

		component.onSubmit();

		expect(profileService.updateUserInformation).toHaveBeenCalledWith(user.id, {
			lastName: "Doe"
		});
	});
});
