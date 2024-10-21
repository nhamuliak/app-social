import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { inject } from "@angular/core";
import { ToastService } from "@core/services/toast/toast.service";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { Router } from "@angular/router";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const toastService = inject(ToastService);
	const authService = inject(AuthService);
	const router = inject(Router);

	return next(req).pipe(
		catchError((err: unknown) => {
			if (err instanceof HttpErrorResponse) {
				// Handle HTTP errors
				if (err.status === 401) {
					// Specific handling for unauthorized errors
					console.error("Unauthorized request:", err);
					// You might trigger a re-authentication flow or redirect the user here
					localStorage.removeItem("access_token");
					router.navigate(["/auth/login"]);
					// authService.logout();
				} else {
					// Handle other HTTP error codes
					console.error("HTTP error:", err);
					errorMessageHandle(err, toastService);
				}
			} else {
				// Handle non-HTTP errors
				console.error("An error occurred:", err);
				errorMessageHandle(err, toastService);
			}

			// Re-throw the error to propagate it further
			return throwError(() => err);
		})
	);
};

// function refreshToken(err: any): void {
// 	// do nothing.
// }

function errorMessageHandle(err: any, toastService: ToastService): void {
	toastService.addMessage({
		type: 0,
		message: err.message,
		action: 0,
		actionLabel: "",
		close: 0,
		errors: []
	});
}
