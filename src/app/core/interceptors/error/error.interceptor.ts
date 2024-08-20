import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { inject } from "@angular/core";
import { AlertService } from "@core/services/alert/alert.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const alertService = inject(AlertService);

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
					errorMessageHandle(err, alertService);
				}
			} else {
				// Handle non-HTTP errors
				console.error("An error occurred:", err);
				errorMessageHandle(err, alertService);
			}

			// Re-throw the error to propagate it further
			return throwError(() => err);
		})
	);
};

function refreshToken(err: any) {}

function errorMessageHandle(err: any, alertService: AlertService) {
	alertService.createAlert({
		type: 0,
		message: err.message,
		action: 0,
		actionLabel: "",
		close: 0,
		errors: []
	});
}
