import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FormErrorComponent } from "./form-error.component";
import { FormControl, Validators } from "@angular/forms";

describe("FormErrorComponent", () => {
	let component: FormErrorComponent;
	let fixture: ComponentFixture<FormErrorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FormErrorComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(FormErrorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should display required error message", () => {
		component.control = new FormControl("", { validators: [Validators.required] });
		component.control.markAsTouched(); // Mark the control as touched to trigger validation

		expect(component.errorMessage).toBe("This field is required.");
	});

	it("should display email error message", () => {
		component.control = new FormControl("invalid-email", { validators: [Validators.email] });
		component.control.markAsTouched();

		expect(component.errorMessage).toBe("Please enter a valid email address.");
	});

	it("should display minlength error message", () => {
		component.control = new FormControl("abc", {
			validators: [Validators.minLength(5)]
		});
		component.control.markAsTouched();

		expect(component.errorMessage).toBe("Minimum length is 5 characters.");
	});

	it("should display maxlength error message", () => {
		component.control = new FormControl("abcdef", {
			validators: [Validators.maxLength(5)]
		});
		component.control.markAsTouched();

		expect(component.errorMessage).toBe("Maximum length is 5 characters.");
	});

	it("should display pattern error message", () => {
		component.control = new FormControl("1234", {
			validators: [Validators.pattern(/^[a-zA-Z]*$/)] // Only allows letters
		});
		component.control.markAsTouched();

		expect(component.errorMessage).toBe("The entered value does not match the required pattern.");
	});

	it("should return null if no errors exist", () => {
		component.control = new FormControl("validInput");
		component.control.markAsTouched();

		expect(component.errorMessage).toBeNull();
	});

	it("should return pattern error message", () => {
		component.control = new FormControl("1234", Validators.pattern(/^[a-zA-Z]*$/)); // Only allows letters
		component.control.markAsTouched();

		expect(component.errorMessage).toBe("The entered value does not match the required pattern.");
	});

	it("should return null if there are no errors", () => {
		component.control = new FormControl("validInput");
		component.control.markAsTouched();

		expect(component.errorMessage).toBeNull();
	});
});
