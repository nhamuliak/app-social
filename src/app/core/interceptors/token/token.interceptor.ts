import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { TokenStoreService } from "@core/services/token-store/token-store.service";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
	const authToken = inject(TokenStoreService).getItem;

	const newReq = req.clone({
		setHeaders: {
			authorization: `Bearer ${authToken}`
		}
	});

	return next(newReq);
};
