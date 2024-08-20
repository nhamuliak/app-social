import { Component, Input } from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";

@Component({
	selector: "app-input",
	standalone: false,
	// imports: [],
	templateUrl: "./input.component.html",
	styleUrl: "./input.component.scss"
})
export class InputComponent implements ControlValueAccessor {
	@Input() type: string = "text";
	@Input() placeholder: string = "Type something...";
	value: any = "";
	disabled: boolean = false;
	isTouched: boolean = false;

	constructor(public ngControl: NgControl) {
		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}
	}

	private onChange: (value: any) => void = () => {};
	private onTouched: () => void = () => {};

	public get errorMessages(): string[] {
		if (this.ngControl && this.ngControl.errors && this.isTouched) {
			return Object.keys(this.ngControl.errors).map(
				key => this.errorMessagesMapping[key] || `Unknown error: ${key}`
			);
		}
		return [];
	}

	writeValue(value: any): void {
		this.value = value;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	onInput({ value }: any): void {
		this.value = value;
		this.onChange(value);
	}

	onBlur(): void {
		this.isTouched = true;
		this.onTouched();
	}

	private errorMessagesMapping: { [key: string]: string } = {
		required: "This field is required.",
		minlength: "The minimum length is not met.",
		maxlength: "The maximum length is exceeded.",
		email: "Invalid email format."
	};
}
