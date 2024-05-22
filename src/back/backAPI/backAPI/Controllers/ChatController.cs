using backAPI.DTO.Chat;
using backAPI.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backAPI.Controllers {
    [Authorize]
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

        [HttpGet("chat/{loggedInUserUsername}/{chatPartnerUsername}")]
        public async Task<ActionResult<IEnumerable<ChatMessageDto>>> GetChatMessages(string loggedInUserUsername, string chatPartnerUsername) {
            var result = await _chatRepository.GetChatMessages(loggedInUserUsername, chatPartnerUsername);
            if(result == null) return BadRequest(new { message = "Failed to retrieve messages." });

            return Ok(result);
        }

        [HttpGet("chat/{loggedInUserUsername}/unread")]
        public async Task<ActionResult<int>> GetUnreadMessages(string loggedInUserUsername) {
            var numberOfMessages = await _chatRepository.GetUnreadMessages(loggedInUserUsername);
            if (numberOfMessages == -1) return BadRequest(new { message = "Failed to retrieve unread messages." });
            return Ok(numberOfMessages);
        }

        [HttpGet("chat/{loggedInUserUsername}/{chatPartnerUsername}/markread")]
        public async Task<ActionResult<int>> MarkMessagesAsRead(string loggedInUserUsername, string chatPartnerUsername) {
            var result = await _chatRepository.MarkMessagesAsRead(loggedInUserUsername, chatPartnerUsername);
            if(result == -1) return BadRequest(new { message = "Failed to mark messages as read." });
            return Ok(result);
        }

        [HttpPost("send")]
        public async Task<ActionResult<ChatMessageDto>> SendMessage(ChatMessageDto message) {
            var result = await _chatRepository.SendMessage(message);
            if(result == null) return BadRequest(new { message = "Failed to send message." });
            return Ok(result);
        }

    }
}
