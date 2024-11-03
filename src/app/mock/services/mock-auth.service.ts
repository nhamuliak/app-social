import { BehaviorSubject, of } from "rxjs";
import { mockUserData } from "@mock/data";
import { mockSocialData } from "@mock/data/mock-auth.data";

export class MockAuthService {
	public getUser = jest.fn().mockReturnValue(mockUserData);
	public recoveryPassword = jest.fn().mockReturnValue(of(null));
	public resetPassword = jest.fn().mockReturnValue(of(null));
	public login = jest.fn().mockReturnValue(of(null));
	public logout = jest.fn().mockReturnValue(of());
	public registration = jest.fn().mockReturnValue(of(null));
	public isAuthenticated = jest.fn();
	public getAuthToken = jest.fn();
	public socialAuth = jest.fn().mockReturnValue(of({ accessToken: "token", user: mockUserData }));
	public userSubject = new BehaviorSubject(mockUserData);
}
