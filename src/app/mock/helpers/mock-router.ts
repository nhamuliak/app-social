export class MockRouter {
	public navigate = jest.fn(() => Promise.resolve());
}
