import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "@modules/auth/services/auth/auth.service";

export const noAuthGuard: CanActivateFn = () => {
	const authService = inject(AuthService);
	const router = inject(Router);

	if (authService.isAuthenticated()) {
		router.navigate(["/"]);

		return false;
	}

	return true;
};
