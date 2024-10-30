import { of } from "rxjs";
import { mockUserData } from "@mock/data";

export class MockProfileService {
	public changePassword = jest.fn().mockReturnValue(of());
	public updateUserAvatar = jest.fn();
	public updateUserInformation = jest.fn().mockReturnValue(of(mockUserData));
}
