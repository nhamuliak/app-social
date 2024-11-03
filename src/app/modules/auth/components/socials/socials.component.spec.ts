import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";

import { SocialsComponent } from "./socials.component";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { MockAuthService, MockCustomSocketService, MockSocialAuthService, MockStoreService } from "@mock/services";
import { Router } from "@angular/router";
import { UserStoreService } from "@core/services/user-store/user-store.service";
import { TokenStoreService } from "@core/services/token-store/token-store.service";
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { CustomSocketService } from "@core/services/custom-socket/custom-socket.service";
import { mockSocialData } from "@mock/data/mock-auth.data";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { mockUserData } from "@mock/data";

describe("SocialsComponent", () => {
	let component: SocialsComponent;
	let fixture: ComponentFixture<SocialsComponent>;
	let mockRouter: Router;
	let mockSocialAuthService: MockSocialAuthService;
	let mockAuthService: MockAuthService;
	let mockUserStoreService: MockStoreService;
	let mockTokenStoreService: MockStoreService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SocialsComponent],
			providers: [
				{
					provide: AuthService,
					useClass: MockAuthService
				},
				{
					provide: Router
				},
				{
					provide: SocialAuthService,
					useClass: MockSocialAuthService
				},
				{
					provide: CustomSocketService,
					useClass: MockCustomSocketService
				},
				{
					provide: UserStoreService,
					useClass: MockStoreService
				},
				{
					provide: TokenStoreService,
					useClass: MockStoreService
				}
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(SocialsComponent);
		component = fixture.componentInstance;

		mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
		mockUserStoreService = TestBed.inject(UserStoreService) as unknown as MockStoreService;
		mockTokenStoreService = TestBed.inject(TokenStoreService) as unknown as MockStoreService;
		mockSocialAuthService = TestBed.inject(SocialAuthService) as unknown as MockSocialAuthService;
		mockRouter = TestBed.inject(Router);

		jest.spyOn(mockRouter, "navigate");
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should handle social authentication on init", fakeAsync(() => {
		component.ngOnInit();

		expect(mockSocialAuthService.authState).toBeTruthy();

		expect(mockAuthService.socialAuth).toHaveBeenCalledWith(mockSocialData);
		expect(mockTokenStoreService.setItem).toHaveBeenCalledWith("token");
		expect(mockUserStoreService.setItem).toHaveBeenCalledWith(mockUserData);

		expect(mockRouter.navigate).toHaveBeenCalledWith(["/"]);
	}));

	it("should sign in with Facebook", () => {
		component.onSignInWithFB();

		expect(mockSocialAuthService.signIn).toHaveBeenCalledWith("FACEBOOK");
	});
});
