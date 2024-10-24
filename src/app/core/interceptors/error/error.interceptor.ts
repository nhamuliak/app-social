import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { inject } from "@angular/core";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const toastrService = inject(ToastrService);
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
					errorMessageHandle(err, toastrService);
				}
			} else {
				// Handle non-HTTP errors
				console.error("An error occurred:", err);
				errorMessageHandle(err, toastrService);
			}

			// Re-throw the error to propagate it further
			return throwError(() => err);
		})
	);
};

// function refreshToken(err: any): void {
// 	// do nothing.
// }

function errorMessageHandle(err: any, toastrService: ToastrService): void {
	toastrService.error(err.message);
}
