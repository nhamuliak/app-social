import { User } from "@shared/models";
import { mockUserData } from "@mock/data";

export class MockStoreService {
	public get getItem(): User | string | null {
		return mockUserData;
	}
	public setItem = jest.fn().mockReturnValue((value: string) => value);
	public removeItem = jest.fn(key => key);
}
