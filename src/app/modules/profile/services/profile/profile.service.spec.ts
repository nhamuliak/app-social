import { TestBed } from "@angular/core/testing";

import { ProfileService } from "./profile.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { environment } from "@environments/environment";
import { UpdateInfo, UpdatePassword } from "@modules/profile/models/profile.model";

interface MockUser {
	id: number;
	firstName: string;
	lastName: string;
	age: number;
}

describe("ProfileService", () => {
	let service: ProfileService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule]
		});
		service = TestBed.inject(ProfileService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	describe("updateUserInformation", () => {
		it("should update user information and return the user", () => {
			const userId = 1;
			const updateInfo: Partial<UpdateInfo> = { firstName: "John", lastName: "Doe" };
			const mockUser: MockUser = { id: userId, firstName: "John", lastName: "Doe", age: 30 };

			service.updateUserInformation(userId, updateInfo).subscribe(user => {
				expect(user).toEqual(mockUser);
			});

			const req = httpMock.expectOne(`${environment.apiUrl}/user/${userId}`);
			expect(req.request.method).toBe("PATCH");
			req.flush(mockUser); // Respond with mock user data
		});
	});

	describe("updateUserAvatar", () => {
		it("should update user avatar and return the user", () => {
			const userId = 1;
			const mockFile = new File([""], "avatar.png", { type: "image/png" });
			const mockUser: MockUser = { id: userId, firstName: "John", lastName: "Doe", age: 30 };

			service.updateUserAvatar(userId, mockFile).subscribe(user => {
				expect(user).toEqual(mockUser);
			});

			const req = httpMock.expectOne(`${environment.apiUrl}/user/${userId}`);
			expect(req.request.method).toBe("PATCH");
			expect(req.request.body instanceof FormData).toBe(true);
			req.flush(mockUser); // Respond with mock user data
		});
	});

	describe("changePassword", () => {
		it("should change user password and return the user", () => {
			const userId = 1;
			const updatePassword: UpdatePassword = { oldPassword: "oldPass", password: "newPass" };
			const mockUser: MockUser = { id: userId, firstName: "John", lastName: "Doe", age: 30 };

			service.changePassword(userId, updatePassword).subscribe(user => {
				expect(user).toEqual(mockUser);
			});

			const req = httpMock.expectOne(`${environment.apiUrl}/user/${userId}`);
			expect(req.request.method).toBe("PATCH");
			req.flush(mockUser); // Respond with mock user data
		});
	});
});
