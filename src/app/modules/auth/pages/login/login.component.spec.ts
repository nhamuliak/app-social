import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";

import { LoginComponent } from "./login.component";
import { Router, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockAuthService, MockStoreService } from "@mock/services";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { StoreService } from "@core/services/store/store.service";
import { CustomSocketService } from "@core/services/custom-socket/custom-socket.service";
import { of } from "rxjs";
import { mockUserData } from "@mock/data";
import { GoogleAuthService } from "@modules/auth/services/google-auth/google-auth.service";

class MockCustomSocketService {
	public connect = jest.fn();
}

class MockGoogleAuthService {}

describe("LoginComponent", () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;

	let mockAuthService: MockAuthService;
	let mockRouter: Router;
	let mockStoreService: MockStoreService;
	// let mockSocketService: MockCustomSocketService;

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
					provide: StoreService,
					useClass: MockStoreService
				},
				{
					provide: CustomSocketService,
					useClass: MockCustomSocketService
				},
				{
					provide: GoogleAuthService,
					useClass: MockGoogleAuthService
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;

		mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
		mockRouter = TestBed.inject(Router);
		mockStoreService = TestBed.inject(StoreService) as unknown as MockStoreService;
		// mockSocketService = TestBed.inject(CustomSocketService) as unknown as MockCustomSocketService;

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

		mockAuthService.login.mockReturnValue(of({ accessToken: "fakeToken" }));

		component.onLogin();

		tick();

		expect(mockAuthService.login).toHaveBeenCalledWith({ email: "test@example.com", password: "password" });
		expect(mockAuthService.setToken).toHaveBeenCalledWith("fakeToken");
		expect(mockStoreService.setItem).toHaveBeenCalledWith("user", mockUserData);
		expect(mockRouter.navigate).toHaveBeenCalledWith(["/"]);
		// expect(mockSocketService.connect).toHaveBeenCalled();
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
