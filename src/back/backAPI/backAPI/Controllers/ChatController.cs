using backAPI.DTO.Chat;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers {
    public class ChatController : BaseApiController {

        private readonly IChatRepository _chatRepository;

        public ChatController(IChatRepository chatRepository) {
            _chatRepository = chatRepository;
        }

        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<ChatPreviewDto>>> GetOldUserConversations(int id) {
            var result = await _chatRepository.GetUsersPreviousChats(id);
            return Ok(result);
        }

        [HttpPost("send")]
        public async Task<ActionResult<ChatMessageDto>> SendMessage(ChatMessageDto message) {
            var result = await _chatRepository.SendMessage(message);
            return Ok(result);
        }

    }
}
