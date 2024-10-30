import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";

import { UserAvatarComponent } from "./user-avatar.component";
import { ToastrService } from "ngx-toastr";
import { ProfileService } from "@modules/profile/services/profile/profile.service";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { StoreService } from "@core/services/store/store.service";
import { MockAuthService, MockProfileService, MockStoreService, MockToastrService } from "@mock/services";
import { of } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("UserAvatarComponent", () => {
	let component: UserAvatarComponent;
	let fixture: ComponentFixture<UserAvatarComponent>;
	let profileService: MockProfileService;
	let toastrService: MockToastrService;
	let authService: MockAuthService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FontAwesomeModule],
			declarations: [UserAvatarComponent],
			providers: [
				{ provide: ToastrService, useClass: MockToastrService },
				{ provide: ProfileService, useClass: MockProfileService },
				{ provide: AuthService, useClass: MockAuthService },
				{ provide: StoreService, useClass: MockStoreService }
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(UserAvatarComponent);
		component = fixture.componentInstance;

		profileService = TestBed.inject(ProfileService) as unknown as MockProfileService;
		toastrService = TestBed.inject(ToastrService) as unknown as MockToastrService;
		authService = TestBed.inject(AuthService) as unknown as MockAuthService;

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
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
		const user = { id: "123" }; // Mock user data
		authService.getUser = jest.fn().mockReturnValue(user);

		profileService.updateUserAvatar.mockReturnValue(of(user));

		component.onSaveFile();

		expect(profileService.updateUserAvatar).toHaveBeenCalledWith(user.id, file);
		expect(toastrService.success).toHaveBeenCalledWith("The avatar was updated.");
		expect(component.loading).toBe(false);
		expect(component.file).toBeNull();
		expect(component.previewImage).toBeNull();
	});

	it("should handle loading state on save file", fakeAsync(() => {
		component.file = new File([""], "avatar.png", { type: "image/png" });
		const user = { id: "123" };
		authService.getUser = jest.fn().mockReturnValue(user);

		profileService.updateUserAvatar.mockReturnValue(of(user));

		component.onSaveFile();

		tick();

		expect(component.loading).toBe(false);
	}));
});
