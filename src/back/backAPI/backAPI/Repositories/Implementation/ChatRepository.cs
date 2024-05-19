using backAPI.Data;
using backAPI.DTO.Chat;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation {
    public class ChatRepository : IChatRepository {

        private readonly DataContext _dataContext;

        public ChatRepository(DataContext dataContext) {
            _dataContext = dataContext;
        }

        
        /// <summary>
        /// Retrieves the previous chats of a user.
        /// </summary>
        /// <param name="userId">The ID of the user.</param>
        /// <returns>A collection of <see cref="ChatPreviewDto"/> representing the user's previous chats.</returns>
        public async Task<IEnumerable<ChatPreviewDto>> GetUsersPreviousChats(int userId) {
            // select all chats where the user is the sender or receiver and get the last message
            var chats = await _dataContext.ChatMessages
                .Where(c => c.SenderId == userId || c.ReceiverId == userId)
                .GroupBy(c => new { c.SenderId, c.ReceiverId })
                .Select(c => c.OrderByDescending(m => m.DateSent).FirstOrDefault())
                .ToListAsync();
            
            var chatPreviewDtos = new List<ChatPreviewDto>();
            foreach(var chat in chats) {
                var conversationPartnerId = chat.SenderId == userId ? chat.ReceiverId : chat.SenderId;
                var conversationPartner = await _dataContext.Users.FindAsync(conversationPartnerId);
                chatPreviewDtos.Add(new ChatPreviewDto {
                    ConversationPartnerName = conversationPartner.FirstName + " " + conversationPartner.LastName,
                    ConversationPartnerPhoto = conversationPartner.ProfilePhoto,
                    LastMessage = chat.Content,
                    DateCreated = chat.DateSent
                });
            }

            return chatPreviewDtos;
        }

        /// <summary>
        /// Sends a chat message and saves it to the database.
        /// </summary>
        /// <param name="message">The chat message to send.</param>
        /// <returns>The sent chat message as a <see cref="ChatMessageDto"/>.</returns>
        public async Task<ChatMessageDto> SendMessage(ChatMessageDto message) {
            var chatMessage = new ChatMessage {
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                Content = message.Content,
                DateSent = DateTime.Now,
                Status = message.Status
            };

            _dataContext.ChatMessages.Add(chatMessage);
            await _dataContext.SaveChangesAsync();

            return new ChatMessageDto {
                Id = chatMessage.Id,
                SenderId = chatMessage.SenderId,
                ReceiverId = chatMessage.ReceiverId,
                Content = chatMessage.Content,
                DateSent = chatMessage.DateSent,
                Status = chatMessage.Status
            };
        }

    }
}
