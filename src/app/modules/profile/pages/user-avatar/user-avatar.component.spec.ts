import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserAvatarComponent } from "./user-avatar.component";
import { ToastrService } from "ngx-toastr";
import { ProfileService } from "@modules/profile/services/profile/profile.service";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { StoreService } from "@core/services/store/store.service";
import { MockAuthService, MockProfileService, MockStoreService, MockToastrService } from "@mock/services";
import { of } from "rxjs";

describe("UserAvatarComponent", () => {
	let component: UserAvatarComponent;
	let fixture: ComponentFixture<UserAvatarComponent>;
	let profileService: MockProfileService;
	let toastrService: MockToastrService;
	let authService: MockAuthService;
	let storeService: MockStoreService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UserAvatarComponent],
			providers: [
				{ provide: ToastrService, useValue: MockToastrService },
				{ provide: ProfileService, useValue: MockProfileService },
				{ provide: AuthService, useValue: MockAuthService },
				{ provide: StoreService, useValue: MockStoreService }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(UserAvatarComponent);
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

	it("should set up the file correctly on file dropped", () => {
		const file = new File([""], "avatar.png", { type: "image/png" });
		component.onFileDropped(file);
		expect(component.file).toBe(file);
		expect(component.previewImage).toBeNull(); // initially null
		expect(component.previewImage).toBeInstanceOf(String); // should be a data URL string after reading
	});

	it("should set up the file correctly on file selected", () => {
		const file = new File([""], "avatar.png", { type: "image/png" });
		const event = { target: { files: [file] } } as unknown as Event;

		component.onFileSelected(event);
		expect(component.file).toBe(file);
		expect(component.previewImage).toBeNull(); // initially null
		expect(component.previewImage).toBeInstanceOf(String); // should be a data URL string after reading
	});

	it("should not set up the file if a non-image file is selected", () => {
		const file = new File([""], "document.pdf", { type: "application/pdf" });
		const event = { target: { files: [file] } } as unknown as Event;

		component.onFileSelected(event);
		expect(component.file).toBeNull();
		expect(toastrService.info).toHaveBeenCalledWith("Please select an image file.");
	});

	it("should call updateUserAvatar method and show success toastr on save", () => {
		const file = new File([""], "avatar.png", { type: "image/png" });
		component.file = file;

		profileService.updateUserAvatar.mockReturnValue(of({ id: "123" })); // mock successful response

		component.onSaveFile();

		expect(profileService.updateUserAvatar).toHaveBeenCalledWith("123", file);
		expect(toastrService.success).toHaveBeenCalledWith("The avatar was updated.");
		expect(component.loading).toBe(false);
		expect(component.file).toBeNull(); // file should be reset
		expect(component.previewImage).toBeNull(); // preview should be reset
	});

	it("should handle loading state on save file", () => {
		const file = new File([""], "avatar.png", { type: "image/png" });
		component.file = file;

		profileService.updateUserAvatar.mockReturnValue(of({ id: "123" })); // mock successful response

		component.onSaveFile();
		expect(component.loading).toBe(true); // loading should be true when saving

		// After observable completes
		expect(component.loading).toBe(false); // loading should be false after completion
	});
});
