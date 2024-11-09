import { BehaviorSubject, of } from "rxjs";
import { mockUserData } from "@mock/data";

export class MockAuthService {
	public user = jest.fn().mockReturnValue(mockUserData);
	public recoveryPassword = jest.fn().mockReturnValue(of(null));
	public resetPassword = jest.fn().mockReturnValue(of(null));
	public login = jest.fn().mockReturnValue(of(null));
	public logout = jest.fn().mockReturnValue(of());
	public registration = jest.fn().mockReturnValue(of(null));
	public refresh = jest.fn();
	public isAuthenticated = jest.fn();
	public getAuthToken = jest.fn();
	public socialAuth = jest.fn().mockReturnValue(of({ accessToken: "token", user: mockUserData }));
	public userSubject = new BehaviorSubject(mockUserData);
}
