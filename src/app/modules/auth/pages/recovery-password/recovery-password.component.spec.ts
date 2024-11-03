import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecoveryPasswordComponent } from "./recovery-password.component";
import { By } from "@angular/platform-browser";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { MockAuthService, MockToastrService } from "@mock/services";
import { ToastrService } from "ngx-toastr";

describe("RecoveryPasswordComponent", () => {
	let component: RecoveryPasswordComponent;
	let fixture: ComponentFixture<RecoveryPasswordComponent>;

	let mockAuthService: MockAuthService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [RecoveryPasswordComponent],
			providers: [
				{
					provide: AuthService,
					useClass: MockAuthService
				},
				{
					provide: ToastrService,
					useClass: MockToastrService
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(RecoveryPasswordComponent);
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

	it("should call recoveryPassword when onReset is called with valid email", () => {
		const email = "test@example.com";
		component.emailCtrl.setValue(email); // Set a valid email

		component.onRecovery();

		expect(mockAuthService.recoveryPassword).toHaveBeenCalledWith(email);
	});

	it("should not call recoveryPassword when onReset is called with invalid email", () => {
		component.emailCtrl.setValue("invalid-email"); // Set an invalid email

		component.onRecovery();

		expect(mockAuthService.recoveryPassword).not.toHaveBeenCalled();
	});

	it("should handle the form submission correctly", () => {
		const button = fixture.debugElement.query(By.css("button.form-submit"));

		component.emailCtrl.setValue("test@example.com"); // Set a valid email
		button.triggerEventHandler("click", null);

		expect(mockAuthService.recoveryPassword).toHaveBeenCalledWith("test@example.com");
	});
});
