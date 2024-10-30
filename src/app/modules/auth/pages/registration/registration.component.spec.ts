import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RegistrationComponent } from "./registration.component";
import { Router, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { MockAuthService } from "@mock/services";
import { of } from "rxjs";

describe("RegistrationComponent", () => {
	let component: RegistrationComponent;
	let fixture: ComponentFixture<RegistrationComponent>;

	let mockAuthService: MockAuthService;
	let mockRouter: Router;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterModule.forRoot([]), FormsModule, ReactiveFormsModule],
			declarations: [RegistrationComponent],
			providers: [
				{
					provide: AuthService,
					useClass: MockAuthService
				},
				{
					provide: Router
				}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(RegistrationComponent);
		component = fixture.componentInstance;

		mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
		mockRouter = TestBed.inject(Router);

		// Note: use spyOn on real Router class to avoid TypeError: Cannot read properties of undefined (reading 'root')
		jest.spyOn(mockRouter, "navigate");

		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize the form on ngOnInit", () => {
		expect(component.form).toBeTruthy();

		expect(component.form.controls["firstName"]).toBeTruthy();
		expect(component.form.controls["lastName"]).toBeTruthy();
		expect(component.form.controls["age"]).toBeTruthy();
		expect(component.form.controls["email"]).toBeTruthy();
		expect(component.form.controls["password"]).toBeTruthy();
		expect(component.form.controls["confirmPassword"]).toBeTruthy();
		expect(component.form.controls["acceptTerms"]).toBeTruthy();
	});

	it("should call registration when onRegister is called with a valid form", () => {
		component.form.controls["firstName"].setValue("John");
		component.form.controls["lastName"].setValue("Doe");
		component.form.controls["age"].setValue(30);
		component.form.controls["email"].setValue("john.doe@example.com");
		component.form.controls["password"].setValue("password123");
		component.form.controls["confirmPassword"].setValue("password123");
		component.form.controls["acceptTerms"].setValue(true);

		// Mock the registration method to return an observable
		mockAuthService.registration.mockReturnValue(of(null));

		component.onRegister();

		expect(mockAuthService.registration).toHaveBeenCalledWith(component.form.value);
		expect(mockRouter.navigate).toHaveBeenCalledWith(["/auth/login"]);
	});

	it("should not call registration when onRegister is called with an invalid form", () => {
		component.form.controls["firstName"].setValue(""); // Invalid first name

		component.onRegister();

		expect(mockAuthService.registration).not.toHaveBeenCalled();
		expect(mockRouter.navigate).not.toHaveBeenCalled();
	});

	it("should show validation error for required fields", () => {
		component.form.controls["firstName"].setValue(""); // Set an empty first name
		expect(component.form.controls["firstName"].valid).toBeFalsy();
		expect(component.form.controls["firstName"].errors).toEqual({ required: true });

		component.form.controls["lastName"].setValue(""); // Set an empty last name
		expect(component.form.controls["lastName"].valid).toBeFalsy();
		expect(component.form.controls["lastName"].errors).toEqual({ required: true });

		component.form.controls["email"].setValue(""); // Set an empty email
		expect(component.form.controls["email"].valid).toBeFalsy();
		expect(component.form.controls["email"].errors).toEqual({ required: true });

		component.form.controls["password"].setValue(""); // Set an empty password
		expect(component.form.controls["password"].valid).toBeFalsy();
		expect(component.form.controls["password"].errors).toEqual({ required: true });

		component.form.controls["confirmPassword"].setValue(""); // Set an empty confirm password
		expect(component.form.controls["confirmPassword"].valid).toBeFalsy();
		expect(component.form.controls["confirmPassword"].errors).toEqual({ required: true });

		// component.form.controls["acceptTerms"].setValue(false); // Set terms not accepted
		// expect(component.form.controls["acceptTerms"].valid).toBeFalsy();
		// expect(component.form.controls["acceptTerms"].errors).toEqual({ required: true });
	});
});
