import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";

import { authGuard } from "./auth.guard";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { MockAuthService } from "@mock/services";
import { MockRouter } from "@mock/helpers";

describe("authGuard", () => {
	const executeGuard: CanActivateFn = (...guardParameters) =>
		TestBed.runInInjectionContext(() => authGuard(...guardParameters));

	let mockAuthService: MockAuthService;
	let mockRouter: MockRouter;

	const mockRoute = {} as ActivatedRouteSnapshot;
	const mockState = {} as RouterStateSnapshot;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: AuthService,
					useClass: MockAuthService
				},
				{
					provide: Router,
					useClass: MockRouter
				}
			]
		});

		mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
		mockRouter = TestBed.inject(Router) as unknown as MockRouter;
	});

	it("should be created", () => {
		expect(executeGuard).toBeTruthy();
	});

	it("should allow access when user is authenticated", () => {
		mockAuthService.isAuthenticated.mockReturnValue(true);

		const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

		expect(result).toBe(true);
		expect(mockRouter.navigate).not.toHaveBeenCalled();
	});

	it("should navigate to login when user is not authenticated", async () => {
		(mockAuthService.isAuthenticated as jest.Mock).mockReturnValue(false);

		const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

		expect(result).toBe(false);
		expect(mockRouter.navigate).toHaveBeenCalledWith(["/auth/login"]);
	});
});
