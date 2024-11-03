import { of } from "rxjs";
import { mockSocialRequestData } from "@mock/data/mock-auth.data";

export class MockSocialAuthService {
	public signIn = jest.fn();
	public authState = of(mockSocialRequestData);
}
