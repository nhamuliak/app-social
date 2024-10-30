import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ProfileService } from "./profile.service";
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
			imports: [HttpClientTestingModule],
			providers: [ProfileService]
		});

		service = TestBed.inject(ProfileService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify(); // Ensure that no unmatched requests are outstanding
	});

	describe("updateUserInformation", () => {
		it("should update user information and return the updated user", () => {
			const mockUser: MockUser = { id: 1, firstName: "John", lastName: "Doe", age: 30 }; // Adjust based on your User model
			const userId = 1;
			const updateData: Partial<UpdateInfo> = { firstName: "Jane" };

			service.updateUserInformation(userId, updateData).subscribe(user => {
				expect(user).toEqual(mockUser);
			});

			const req = httpMock.expectOne(`${service["urlPath"]}/${userId}`);
			expect(req.request.method).toBe("PATCH");
			req.flush(mockUser); // Simulate returning the updated user
		});
	});

	describe("updateUserAvatar", () => {
		it("should update user avatar and return the updated user", () => {
			const mockUser: MockUser = { id: 1, firstName: "John", lastName: "Doe", age: 30 }; // Adjust based on your User model
			const userId = 1;
			const file = new File([""], "test-image.png", { type: "image/png" });

			service.updateUserAvatar(userId, file).subscribe(user => {
				expect(user).toEqual(mockUser);
			});

			const req = httpMock.expectOne(`${service["urlPath"]}/${userId}`);
			expect(req.request.method).toBe("PATCH");
			expect(req.request.body.get("file")).toBeDefined();
			req.flush(mockUser); // Simulate returning the updated user
		});
	});

	describe("changePassword", () => {
		it("should change user password and return the updated user", () => {
			const mockUser: MockUser = { id: 1, firstName: "John", lastName: "Doe", age: 30 }; // Adjust based on your User model
			const userId = 1;
			const passwordData: UpdatePassword = { oldPassword: "oldpass", password: "newpass" };

			service.changePassword(userId, passwordData).subscribe(user => {
				expect(user).toEqual(mockUser);
			});

			const req = httpMock.expectOne(`${service["urlPath"]}/${userId}`);
			expect(req.request.method).toBe("PATCH");
			req.flush(mockUser); // Simulate returning the updated user
		});
	});
});
