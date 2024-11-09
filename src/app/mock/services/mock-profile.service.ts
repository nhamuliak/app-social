import { of } from "rxjs";
import { mockUserData } from "@mock/data";

export class MockProfileService {
	public changePassword = jest.fn().mockReturnValue(of(true));
	public updateUserAvatar = jest.fn().mockReturnValue(of(mockUserData));
	public updateUserInformation = jest.fn().mockReturnValue(of(mockUserData));
}
