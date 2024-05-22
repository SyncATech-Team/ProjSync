using backAPI.Data;
using backAPI.DTO.Chat;

namespace backAPI.Repositories.Interface {
    public interface IChatRepository {

        Task<IEnumerable<ChatPreviewDto>> GetUsersPreviousChats(int userId);
        Task<ChatMessageDto> SendMessage(ChatMessageDto message);
        Task<IEnumerable<ChatMessageDto>> GetChatMessages(string loggedInUserUsername, string chatPartnerUsername);
        Task<int> GetUnreadMessages(string loggedInUserUsername);
        Task<int> MarkMessagesAsRead(string loggedInUserUsername, string chatPartnerUsername);

    }
}
