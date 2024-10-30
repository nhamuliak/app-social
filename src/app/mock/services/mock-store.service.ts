export class MockStoreService {
	public setItem = jest.fn();
	public removeItem = jest.fn(key => key);
}
