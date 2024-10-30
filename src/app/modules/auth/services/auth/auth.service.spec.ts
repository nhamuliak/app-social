import { TestBed } from "@angular/core/testing";

import { AuthService } from "./auth.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { LoginRequestBody, RegisterRequestBody, Token } from "@modules/auth/models/auth.model";
import { environment } from "@environments/environment";
import { mockLoginData, mockRegisterData } from "@mock/data";

describe("AuthService", () => {
	let service: AuthService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule]
		});
		service = TestBed.inject(AuthService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
		jest.clearAllMocks();
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	describe("registration", () => {
		it("should call the registration API with the correct body", done => {
			const registerBody: RegisterRequestBody = mockRegisterData;

			service.registration(registerBody).subscribe(response => {
				expect(response).toBeTruthy();
				done();
			});

			const req = httpMock.expectOne(`${environment.apiUrl}/auth/registration`);
			expect(req.request.method).toBe("POST");
			expect(req.request.body).toEqual(registerBody);
			req.flush({});
		});
	});

	describe("login", () => {
		it("should call the login API with the correct body and return tokens", done => {
			const loginBody: LoginRequestBody = mockLoginData;
			const mockToken: Token = { accessToken: "access_token", refreshToken: "refresh_token" };

			service.login(loginBody).subscribe(token => {
				expect(token).toEqual(mockToken);
				done();
			});

			const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
			expect(req.request.method).toBe("POST");
			expect(req.request.body).toEqual(loginBody);
			req.flush(mockToken);
		});
	});

	describe("resetPassword", () => {
		it("should call the reset password API with the correct email", done => {
			const email = "test@example.com";

			service.resetPassword(email).subscribe(response => {
				expect(response).toBeTruthy();
				done();
			});

			const req = httpMock.expectOne(`${environment.apiUrl}/auth/reset-password`);
			expect(req.request.method).toBe("POST");
			expect(req.request.body).toEqual({ email });
			req.flush({});
		});
	});

	describe("logout", () => {
		it("should call the logout API", done => {
			service.logout().subscribe(response => {
				expect(response).toBeTruthy();
				done();
			});

			const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
			expect(req.request.method).toBe("POST");
			req.flush({});
		});
	});

	describe("getAuthToken", () => {
		it("should return the access token from localStorage", () => {
			const token = "access_token";
			jest.spyOn(Storage.prototype, "getItem").mockReturnValue(token);

			expect(service.getAuthToken()).toBe(token);
		});
	});
});
