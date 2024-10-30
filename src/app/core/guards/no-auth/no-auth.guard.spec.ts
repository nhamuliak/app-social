import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";

import { noAuthGuard } from "./no-auth.guard";
import { AuthService } from "@modules/auth/services/auth/auth.service";
import { MockAuthService } from "@mock/services";
import { MockRouter } from "@mock/helpers";

describe("noAuthGuard", () => {
	const executeGuard: CanActivateFn = (...guardParameters) =>
		TestBed.runInInjectionContext(() => noAuthGuard(...guardParameters));

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

	it("should allow access when user is not authenticated", () => {
		mockAuthService.isAuthenticated.mockReturnValue(false);

		const result = TestBed.runInInjectionContext(() => noAuthGuard(mockRoute, mockState));

		expect(result).toBe(true);
		expect(mockRouter.navigate).not.toHaveBeenCalled();
	});

	it("should navigate to home when user is authenticated", async () => {
		mockAuthService.isAuthenticated.mockReturnValue(true);

		const result = await TestBed.runInInjectionContext(() => noAuthGuard(mockRoute, mockState));

		expect(result).toBe(false);
		expect(mockRouter.navigate).toHaveBeenCalledWith(["/"]);
	});
});
