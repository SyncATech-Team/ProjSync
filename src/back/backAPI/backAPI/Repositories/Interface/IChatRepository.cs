using backAPI.Data;
using backAPI.DTO.Chat;

namespace backAPI.Repositories.Interface {
    public interface IChatRepository {

        Task<IEnumerable<ChatPreviewDto>> GetUsersPreviousChats(int userId);
        Task<ChatMessageDto> SendMessage(ChatMessageDto message);

    }
}
