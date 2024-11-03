import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
	selector: "app-form-error",
	standalone: true,
	imports: [],
	templateUrl: "./form-error.component.html",
	styleUrl: "./form-error.component.scss"
})
export class FormErrorComponent {
	@Input() public control!: FormControl;

	public get errorMessage(): string | null {
		if (this.control && this.control.errors) {
			if (this.control.hasError("required")) {
				return "This field is required.";
			}
			if (this.control.hasError("email")) {
				return "Please enter a valid email address.";
			}
			if (this.control.hasError("minlength")) {
				const requiredLength = this.control.errors["minlength"].requiredLength;
				return `Minimum length is ${requiredLength} characters.`;
			}
			if (this.control.hasError("maxlength")) {
				const requiredLength = this.control.errors["maxlength"].requiredLength;
				return `Maximum length is ${requiredLength} characters.`;
			}
			if (this.control.hasError("pattern")) {
				return "The entered value does not match the required pattern.";
			}
			// Add more error types as needed
		}
		return null;
	}
}
