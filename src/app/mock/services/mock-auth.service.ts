export class MockAuthService {
	getUser = jest.fn().mockReturnValue({ id: "123" });
	userSubject = { next: jest.fn() };
}
