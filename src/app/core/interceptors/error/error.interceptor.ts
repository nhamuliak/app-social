import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { inject } from "@angular/core";
import { ToastService } from "@core/services/toast/toast.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const toastService = inject(ToastService);

	return next(req).pipe(
		catchError((err: any) => {
			if (err instanceof HttpErrorResponse) {
				// Handle HTTP errors
				if (err.status === 401) {
					// Specific handling for unauthorized errors
					console.error("Unauthorized request:", err);
					// You might trigger a re-authentication flow or redirect the user here
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

function refreshToken(err: any) {}

function errorMessageHandle(err: any, toastService: ToastService) {
	toastService.addMessage({
		type: 0,
		message: err.message,
		action: 0,
		actionLabel: "",
		close: 0,
		errors: []
	});
}
