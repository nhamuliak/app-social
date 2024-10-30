import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { inject } from "@angular/core";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const toastrService = inject(ToastrService);
	// eslint-disable-next-line
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
					errorMessageHandle(err, toastrService);
				}
			} else {
				// Handle non-HTTP errors
				errorMessageHandle(err, toastrService);
			}

			// Re-throw the error to propagate it further
			return throwError(() => err);
		})
	);
};

// eslint-disable-next-line
function errorMessageHandle(err: any, toastrService: ToastrService): void {
	console.error(err);

	toastrService.error(err.error.message);
}
