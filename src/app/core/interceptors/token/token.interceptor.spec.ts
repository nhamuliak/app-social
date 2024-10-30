import { TestBed } from "@angular/core/testing";
import { HTTP_INTERCEPTORS, HttpHandler, HttpInterceptorFn, HttpRequest } from "@angular/common/http";

import { tokenInterceptor } from "./token.interceptor";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { MockAuthService } from "@mock/services";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe("tokenInterceptor", () => {
	const interceptor: HttpInterceptorFn = (req, next) =>
		TestBed.runInInjectionContext(() => tokenInterceptor(req, next));

	const mockToken = "mock-token";
	let mockAuthService: MockAuthService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				{
					provide: AuthService,
					useClass: MockAuthService
				},
				{
					provide: HTTP_INTERCEPTORS,
					useValue: tokenInterceptor,
					multi: true
				}
			]
		});

		mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
		httpTestingController = TestBed.inject(HttpTestingController);

		mockAuthService.getAuthToken = jest.fn().mockReturnValue(mockToken);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it("should be created", () => {
		expect(interceptor).toBeTruthy();
	});

	it("should call next with the modified request", () => {
		const req = new HttpRequest("GET", "/test");
		const next: HttpHandler = {
			handle: jest.fn().mockReturnValue(Promise.resolve())
		};

		TestBed.runInInjectionContext(() => tokenInterceptor(req, next.handle));

		expect(next.handle).toHaveBeenCalledTimes(1);
		expect(next.handle).toHaveBeenCalledWith(expect.any(HttpRequest));
	});
});
