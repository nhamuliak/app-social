import { Component, Input } from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";

@Component({
	selector: "app-input",
	standalone: false,
	templateUrl: "./input.component.html",
	styleUrl: "./input.component.scss"
})
export class InputComponent implements ControlValueAccessor {
	@Input() public type = "text";
	@Input() public placeholder = "Type something...";
	public value = "";
	public disabled = false;
	public isTouched = false;

	constructor(public ngControl: NgControl) {
		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}
	}

	private onChange: (value: string) => void = () => {
		// do nothing.
	};
	private onTouched: () => void = () => {
		// do nothing.
	};

	public get errorMessages(): string[] {
		if (this.ngControl && this.ngControl.errors && this.isTouched) {
			return Object.keys(this.ngControl.errors).map(
				key => this.errorMessagesMapping[key] || `Unknown error: ${key}`
			);
		}
		return [];
	}

	public writeValue(value: string): void {
		this.value = value;
	}

	public registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	public onInput({ value }: any): void {
		this.value = value;
		this.onChange(value);
	}

	public onBlur(): void {
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
