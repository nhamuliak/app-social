import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, switchMap, take, throwError } from "rxjs";
import { inject } from "@angular/core";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { TokenStoreService } from "@core/services/token-store/token-store.service";
import { UserStoreService } from "@core/services/user-store/user-store.service";
import { Router } from "@angular/router";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const toastrService = inject(ToastrService);
	const tokenStoreService = inject(TokenStoreService);
	const userStoreService = inject(UserStoreService);
	const router = inject(Router);
	const authService = inject(AuthService);

	return next(req).pipe(
		catchError((err: unknown) => {
			if (err instanceof HttpErrorResponse) {
				if (err.status === 401) {
					return authService.refresh().pipe(
						switchMap(({ accessToken }: { accessToken: string }) => {
							tokenStoreService.setItem(accessToken);

							const retryRequest = req.clone({
								setHeaders: { Authorization: `Bearer ${accessToken}` }
							});

							return next(retryRequest);
						}),
						catchError(refreshError => {
							authService
								.logout()
								.pipe(take(1))
								.subscribe(() => {
									tokenStoreService.removeItem();
									userStoreService.removeItem();

									router.navigate(["/auth/login"]);
								});

							return throwError(() => refreshError);
						})
					);
				} else {
					errorMessageHandle(err, toastrService);
				}
			} else {
				errorMessageHandle(err, toastrService);
			}

			return throwError(() => err);
		})
	);
};

// eslint-disable-next-line
function errorMessageHandle(err: any, toastrService: ToastrService): void {
	console.error(err);

	const errorTitle = err.error.message?.error || "Error";
	const errorMessage = err.error.message?.message ? err.error.message.message : err.error.message;

	toastrService.error(errorMessage, errorTitle);
}
