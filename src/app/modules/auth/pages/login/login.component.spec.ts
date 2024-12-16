import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { Router, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockAuthService, MockCustomSocketService, MockStoreService } from "@mock/services";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { CustomSocketService } from "@core/services/custom-socket/custom-socket.service";
import { of } from "rxjs";
import { mockUserData } from "@mock/data";
import { UserStoreService } from "@core/services/user-store/user-store.service";
import { TokenStoreService } from "@core/services/token-store/token-store.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("LoginComponent", () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;

	let mockAuthService: MockAuthService;
	let mockRouter: Router;
	let mockUserStoreService: MockStoreService;
	let mockTokenStoreService: MockStoreService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterModule.forRoot([]), ReactiveFormsModule, FormsModule],
			declarations: [LoginComponent],
			providers: [
				{
					provide: AuthService,
					useClass: MockAuthService
				},
				{
					provide: Router
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

		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;

		mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
		mockUserStoreService = TestBed.inject(UserStoreService) as unknown as MockStoreService;
		mockTokenStoreService = TestBed.inject(TokenStoreService) as unknown as MockStoreService;
		mockRouter = TestBed.inject(Router);

		// Note: use spyOn on real Router class to avoid TypeError: Cannot read properties of undefined (reading 'root')
		jest.spyOn(mockRouter, "navigate");

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize the form on ngOnInit", () => {
		component.ngOnInit();

		expect(component.form).toBeDefined();
		expect(component.form.controls["email"].validator).toBeDefined();
		expect(component.form.controls["password"].validator).toBeDefined();
	});

	it("should call login service and navigate on successful login", fakeAsync(() => {
		component.ngOnInit();

		component.form.controls["email"].setValue("test@example.com");
		component.form.controls["password"].setValue("password");

		mockAuthService.login.mockReturnValue(of({ accessToken: "fakeToken", user: mockUserData }));

		component.onLogin();

		expect(mockAuthService.login).toHaveBeenCalledWith({ email: "test@example.com", password: "password" });
		expect(mockTokenStoreService.setItem).toHaveBeenCalledWith("fakeToken");
		expect(mockUserStoreService.setItem).toHaveBeenCalledWith(mockUserData);
		expect(mockRouter.navigate).toHaveBeenCalledWith(["/"]);
	}));

	it("should not call login service if the form is invalid", () => {
		component.ngOnInit();

		component.form.controls["email"].setValue("");
		component.form.controls["password"].setValue("password");

		component.onLogin();

		expect(mockAuthService.login).not.toHaveBeenCalled();
	});

	it("should call initForm on ngOnInit", () => {
		component.ngOnInit();

		expect(component.form).toBeDefined();
	});
});
