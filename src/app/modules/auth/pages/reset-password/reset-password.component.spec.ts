import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ResetPasswordComponent } from "./reset-password.component";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { MockAuthService, MockToastrService } from "@mock/services";
import { By } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("ResetPasswordComponent", () => {
	let component: ResetPasswordComponent;
	let fixture: ComponentFixture<ResetPasswordComponent>;

	let mockAuthService: MockAuthService;
	let mockToastrService: MockToastrService;
	let mockRouter: Router;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterModule.forRoot([]), FormsModule, ReactiveFormsModule],
			declarations: [ResetPasswordComponent],
			providers: [
				{
					provide: AuthService,
					useClass: MockAuthService
				},
				{
					provide: ToastrService,
					useClass: MockToastrService
				},
				{
					provide: ActivatedRoute,
					useValue: { snapshot: { queryParams: { token: "test-token" } } }
				},
				Router
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();

		fixture = TestBed.createComponent(ResetPasswordComponent);
		component = fixture.componentInstance;

		mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
		mockToastrService = TestBed.inject(ToastrService) as unknown as MockToastrService;
		mockRouter = TestBed.inject(Router);

		jest.spyOn(mockRouter, "navigate");

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize password control", () => {
		expect(component.passwordCtrl).toBeTruthy();
		expect(component.passwordCtrl.valid).toBeFalsy();
	});

	it("should call resetPassword when onReset is called with valid password", () => {
		const password = "qwe123";
		component.passwordCtrl.setValue(password);

		jest.spyOn(mockAuthService, "resetPassword").mockReturnValue(of({ message: "Password reset successful" }));
		component.onReset();

		expect(mockAuthService.resetPassword).toHaveBeenCalledWith("test-token", password);
	});

	it("should not call resetPassword when onReset is called with invalid password", () => {
		component.passwordCtrl.setValue("");

		jest.spyOn(mockAuthService, "resetPassword");
		component.onReset();

		expect(mockAuthService.resetPassword).not.toHaveBeenCalled();
	});

	it("should handle form submission correctly", () => {
		const password = "qwe12345";
		const button = fixture.debugElement.query(By.css("button.form-submit"));

		component.passwordCtrl.setValue(password);
		jest.spyOn(mockAuthService, "resetPassword").mockReturnValue(of({ message: "Password reset successful" }));
		jest.spyOn(mockToastrService, "success");

		button.nativeElement.click();

		expect(mockAuthService.resetPassword).toHaveBeenCalledWith("test-token", password);
		expect(mockRouter.navigate).toHaveBeenCalledWith(["/auth/login"]);
	});

	it("should set loading to true, handle errors, and stop loading on failure", () => {
		const password = "newpassword123";
		component.passwordCtrl.setValue(password);

		jest.spyOn(mockAuthService, "resetPassword").mockReturnValue(throwError(() => new Error("Reset failed")));

		component.onReset();

		expect(mockRouter.navigate).not.toHaveBeenCalled();
	});
});
