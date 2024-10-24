import { FormGroup } from "@angular/forms";

export const passwordMatchValidator = (passwordKey: string, confirmPasswordKey: string) => {
	return (group: FormGroup) => {
		const newPassword = group.get(passwordKey)?.value;
		const confirmNewPassword = group.get(confirmPasswordKey)?.value;

		return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
	};
};
