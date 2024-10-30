import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { inject } from "@angular/core";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
	const authToken = inject(AuthService).getAuthToken();

	const newReq = req.clone({
		setHeaders: {
			authorization: `Bearer ${authToken}`
		}
	});

	return next(newReq);
};
