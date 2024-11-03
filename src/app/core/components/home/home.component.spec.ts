import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HomeComponent } from "./home.component";
import { MockAuthService, MockCustomSocketService, MockStoreService } from "@mock/services";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { User } from "@shared/models";
import { mockUserData } from "@mock/data";
import { CustomSocketService } from "@core/services/custom-socket/custom-socket.service";
import { Router } from "@angular/router";
import { MockRouter } from "@mock/helpers";
import { UserStoreService } from "@core/services/user-store/user-store.service";
import { TokenStoreService } from "@core/services/token-store/token-store.service";

describe("HomeComponent", () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;

	let mockAuthService: MockAuthService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HomeComponent],
			providers: [
				{
					provide: AuthService,
					useClass: MockAuthService
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
				},
				{
					provide: Router,
					useClass: MockRouter
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;

		mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should subscribe to userSubject on init", () => {
		const user: User = mockUserData;

		mockAuthService.userSubject.next(user);

		component.ngOnInit();

		expect(component.user).toEqual(user);
	});
});
