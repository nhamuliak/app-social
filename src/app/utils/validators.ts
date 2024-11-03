import { FormControl, FormGroup } from "@angular/forms";

export const passwordMatchValidator = (passwordKey: string, confirmPasswordKey: string) => {
	return (group: FormGroup) => {
		const newPassword = group.get(passwordKey)?.value;
		const confirmNewPassword = group.get(confirmPasswordKey)?.value;

		return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
	};
};

export const markAllAsRequired = (form: FormGroup): void => {
	Object.keys(form.controls).forEach(key => {
		const control = form.get(key);

		if (control instanceof FormControl) {
			control.markAsTouched();

			if (!control.value) {
				control.setErrors({ required: true });
			}
		}
	});
};
