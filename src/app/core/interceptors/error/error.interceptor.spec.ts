import { TestBed } from "@angular/core/testing";
import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";

import { errorInterceptor } from "./error.interceptor";
import { MockAuthService, MockStoreService, MockToastrService } from "@mock/services";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { of, throwError } from "rxjs";
import { UserStoreService } from "@core/services/user-store/user-store.service";
import { TokenStoreService } from "@core/services/token-store/token-store.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

describe("errorInterceptor", () => {
	const interceptor: HttpInterceptorFn = (req, next) =>
		TestBed.runInInjectionContext(() => errorInterceptor(req, next));

	let mockAuthService: MockAuthService;
	let mockUserStoreService: MockStoreService;
	let mockTokenStoreService: MockStoreService;
	let mockToastrService: MockToastrService;
	let mockRouter: Router;
	// eslint-disable-next-line
	let mockNext: any;
	// eslint-disable-next-line
	let mockRequest: any;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: HTTP_INTERCEPTORS,
					useValue: errorInterceptor,
					multi: true
				},
				{
					provide: AuthService,
					useClass: MockAuthService
				},
				{
					provide: UserStoreService,
					useClass: MockStoreService
				},
				{
					provide: TokenStoreService,
					useClass: MockStoreService
				},
				{
					provide: ToastrService,
					useClass: MockToastrService
				},
				Router
			]
		});

		mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
		mockUserStoreService = TestBed.inject(UserStoreService) as unknown as MockStoreService;
		mockTokenStoreService = TestBed.inject(TokenStoreService) as unknown as MockStoreService;
		mockToastrService = TestBed.inject(ToastrService) as unknown as MockToastrService;
		mockRouter = TestBed.inject(Router);

		mockNext = jest.fn().mockImplementation(req => {
			return of(req);
		});

		mockRequest = {};
	});

	it("should be created", () => {
		expect(interceptor).toBeTruthy();
	});

	it("should handle 401 error and refresh token", () => {
		const mockAccessToken = "new-access-token";
		mockAuthService.refresh = jest.fn().mockReturnValue(of({ accessToken: mockAccessToken }));

		const errResponse = new HttpErrorResponse({
			error: "Unauthorized",
			status: 401
		});
		mockNext.mockImplementationOnce(() => throwError(() => errResponse));

		TestBed.runInInjectionContext(() => {
			const interceptor = errorInterceptor(mockRequest, mockNext);
			interceptor.subscribe(() => {
				expect(mockAuthService.refresh).toHaveBeenCalled();
				expect(mockTokenStoreService.setItem).toHaveBeenCalledWith(mockAccessToken);
				expect(mockNext).toHaveBeenCalledWith(
					expect.objectContaining({
						setHeaders: { Authorization: `Bearer ${mockAccessToken}` }
					})
				);
			});
		});
	});

	it("should handle refresh token error and logout", () => {
		const mockErrorResponse = new HttpErrorResponse({
			error: "Unauthorized",
			status: 401
		});
		const refreshError = new HttpErrorResponse({
			error: "Refresh token expired",
			status: 401
		});

		mockAuthService.refresh = jest.fn().mockReturnValue(throwError(() => refreshError));
		mockAuthService.logout = jest.fn().mockReturnValue(of(null));
		mockNext.mockImplementationOnce(() => throwError(() => mockErrorResponse));

		TestBed.runInInjectionContext(() => {
			const interceptor = errorInterceptor(mockRequest, mockNext);
			interceptor.subscribe({
				error: () => {
					expect(mockAuthService.logout).toHaveBeenCalled();
					expect(mockTokenStoreService.removeItem).toHaveBeenCalled();
					expect(mockUserStoreService.removeItem).toHaveBeenCalled();
					expect(mockRouter.navigate).toHaveBeenCalledWith(["/auth/login"]);
				}
			});
		});
	});

	it("should handle non-401 errors", () => {
		const errorResponse = new HttpErrorResponse({
			error: { message: { error: "Error", message: "Some error occurred" } },
			status: 500
		});

		mockNext.mockImplementationOnce(() => throwError(() => errorResponse));

		TestBed.runInInjectionContext(() => {
			const interceptor = errorInterceptor(mockRequest, mockNext);
			interceptor.subscribe({
				error: () => {
					expect(mockToastrService.error).toHaveBeenCalledWith("Some error occurred", "Error");
				}
			});
		});
	});
});
