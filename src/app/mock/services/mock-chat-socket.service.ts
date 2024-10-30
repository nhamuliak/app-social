export class MockChatSocketService {
	public checkIsRoomDeleted = jest.fn();
	public checkLastMessages = jest.fn();
	public checkOnlineUsers = jest.fn();
	public checkNewMessage = jest.fn();
	public emitSendMessage = jest.fn();
	public markMessagesAsRead = jest.fn();
}
