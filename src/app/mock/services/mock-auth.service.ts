import { BehaviorSubject, of } from "rxjs";
import { mockUserData } from "@mock/data";

export class MockAuthService {
	public getUser = jest.fn().mockReturnValue(mockUserData);
	public resetPassword = jest.fn().mockReturnValue(of(null));
	public login = jest.fn().mockReturnValue(of(null));
	public logout = jest.fn().mockReturnValue(of());
	public registration = jest.fn().mockReturnValue(of(null));
	public isAuthenticated = jest.fn();
	public getAuthToken = jest.fn();
	public setToken = jest.fn();
	public userSubject = new BehaviorSubject(mockUserData);
}
