import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ResetPasswordComponent } from "./reset-password.component";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { MockAuthService } from "@mock/services";
import { By } from "@angular/platform-browser";

describe("ResetPasswordComponent", () => {
	let component: ResetPasswordComponent;
	let fixture: ComponentFixture<ResetPasswordComponent>;

	let mockAuthService: MockAuthService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterModule.forRoot([]), FormsModule, ReactiveFormsModule],
			declarations: [ResetPasswordComponent],
			providers: [
				{
					provide: AuthService,
					useClass: MockAuthService
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ResetPasswordComponent);
		component = fixture.componentInstance;

		mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize email control", () => {
		expect(component.emailCtrl).toBeTruthy();
		expect(component.emailCtrl.valid).toBeFalsy();
	});

	it("should call resetPassword when onReset is called with valid email", () => {
		const email = "test@example.com";
		component.emailCtrl.setValue(email); // Set a valid email

		component.onReset();

		expect(mockAuthService.resetPassword).toHaveBeenCalledWith(email);
	});

	it("should not call resetPassword when onReset is called with invalid email", () => {
		component.emailCtrl.setValue("invalid-email"); // Set an invalid email

		component.onReset();

		expect(mockAuthService.resetPassword).not.toHaveBeenCalled();
	});

	it("should handle the form submission correctly", () => {
		const button = fixture.debugElement.query(By.css("button.form-submit"));

		component.emailCtrl.setValue("test@example.com"); // Set a valid email
		button.triggerEventHandler("click", null);

		expect(mockAuthService.resetPassword).toHaveBeenCalledWith("test@example.com");
	});
});
