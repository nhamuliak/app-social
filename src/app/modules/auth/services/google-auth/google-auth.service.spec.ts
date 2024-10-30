import { TestBed } from "@angular/core/testing";

import { GoogleAuthService } from "./google-auth.service";
import { OAuthService } from "angular-oauth2-oidc";

class MockOAuthService {
	public configure = jest.fn();
}

describe("GoogleAuthService", () => {
	let service: GoogleAuthService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: OAuthService,
					useClass: MockOAuthService
				}
			]
		});
		service = TestBed.inject(GoogleAuthService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
