import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { inject } from "@angular/core";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
	// Inject the current `AuthService` and use it to get an authentication token:
	const authToken = inject(AuthService).getAuthToken();

	// Clone the request to add the authentication header.
	const newReq = req.clone({
		setHeaders: {
			authorization: `Bearer ${authToken}`
		}
	});

	return next(newReq);
};
