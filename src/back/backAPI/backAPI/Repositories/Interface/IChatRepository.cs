using backAPI.Data;
using backAPI.DTO.Chat;

namespace backAPI.Repositories.Interface {
    public interface IChatRepository {

        Task<IEnumerable<ChatPreviewDto>> GetUsersPreviousChats(int userId);
        Task<ChatMessageDto> SendMessage(ChatMessageDto message);
        Task<IEnumerable<ChatMessageDto>> GetChatMessages(string loggedInUserUsername, string chatPartnerUsername);

    }
}
