export class MockChatService {
	public getConversations = jest.fn();
	public getLatestConversations = jest.fn();
	public createConversation = jest.fn();
	public deleteConversation = jest.fn();
	public getUsers = jest.fn();
	public getMessages = jest.fn();
	public createMessage = jest.fn();
	public getReceiver = jest.fn();
}
