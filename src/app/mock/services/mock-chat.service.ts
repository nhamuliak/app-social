import { of } from "rxjs";

export class MockChatService {
	public getConversations = jest.fn();
	public getLatestConversations = jest.fn();
	public createConversation = jest.fn();
	public deleteConversation = jest.fn().mockReturnValue(of());
	public getUsers = jest.fn();
	public getMessages = jest.fn();
	public createMessage = jest.fn().mockReturnValue(of());
	public getReceiver = jest.fn();
}
