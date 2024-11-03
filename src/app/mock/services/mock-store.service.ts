export class MockStoreService {
	public getItem = jest.fn().mockReturnValue("");
	public setItem = jest.fn().mockReturnValue((value: string) => value);
	public removeItem = jest.fn(key => key);
}
