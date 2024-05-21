using backAPI.Data;
using backAPI.DTO.Chat;
using backAPI.Entities.Domain;
using backAPI.Repositories.Interface;
using backAPI.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backAPI.Repositories.Implementation {
    public class ChatRepository : IChatRepository {

        private readonly DataContext _dataContext;
        private readonly IUsersRepository _usersRepository;
        private readonly NotificationService _notificationService;

        public ChatRepository(
            DataContext dataContext,
            IUsersRepository usersRepository,
            NotificationService notificationService
        ) {
            _dataContext = dataContext;
            _usersRepository = usersRepository;
            _notificationService = notificationService;
        }


        /// <summary>
        /// Retrieves the previous chats of a user.
        /// </summary>
        /// <param name="userId">The ID of the user.</param>
        /// <returns>A collection of <see cref="ChatPreviewDto"/> representing the user's previous chats.</returns>
        public async Task<IEnumerable<ChatPreviewDto>> GetUsersPreviousChats(int userId) {
            // select all chats where the user is the sender or receiver and get the last message
            var chats = await _dataContext.ChatMessages
                .Where(c => (c.SenderId == userId && c.ReceiverId != userId) || (c.SenderId != userId && c.ReceiverId == userId) || (c.SenderId == userId && c.ReceiverId == userId))
                .GroupBy(c => new { SenderId = Math.Min(c.SenderId, c.ReceiverId), ReceiverId = Math.Max(c.SenderId, c.ReceiverId) })
                .Select(c => c.OrderByDescending(m => m.DateSent).FirstOrDefault())
                .ToListAsync();
            
            var chatPreviewDtos = new List<ChatPreviewDto>();
            foreach(var chat in chats) {
                var conversationPartnerId = chat.SenderId == userId ? chat.ReceiverId : chat.SenderId;
                var conversationPartner = await _dataContext.Users.FindAsync(conversationPartnerId);
                chatPreviewDtos.Add(new ChatPreviewDto {
                    ConversationPartnerId = conversationPartner.Id,
                    ConversationPartnerUsername = conversationPartner.UserName,
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

            var sender = await _usersRepository.GetUserByUsername(message.SenderUsername);
            var receiver = await _usersRepository.GetUserByUsername(message.ReceiverUsername);

            if(sender == null || receiver == null) return null;

            var chatMessage = new ChatMessage {
                SenderId = sender.Id,
                ReceiverId = receiver.Id,
                Content = message.Content,
                DateSent = DateTime.Now,
                Status = message.Status
            };

            _dataContext.ChatMessages.Add(chatMessage);
            await _dataContext.SaveChangesAsync();

            string[] users = { receiver.UserName };
            await _notificationService.SendChatMessageNotification(users , message);

            return new ChatMessageDto {
                Id = chatMessage.Id,
                SenderUsername = sender.UserName,
                ReceiverUsername = receiver.UserName,
                Content = chatMessage.Content,
                DateSent = chatMessage.DateSent,
                Status = chatMessage.Status
            };
        }
        
        public async Task<IEnumerable<ChatMessageDto>> GetChatMessages(string loggedInUserUsername, string chatPartnerUsername) {
            
            var loggedInUser = await _usersRepository.GetUserByUsername(loggedInUserUsername);
            var chatPartner = await _usersRepository.GetUserByUsername(chatPartnerUsername);

            if(loggedInUser == null || chatPartner == null) return null;

            var chatMessages = await _dataContext.ChatMessages
                .Where(c => (c.SenderId == loggedInUser.Id && c.ReceiverId == chatPartner.Id) || (c.SenderId == chatPartner.Id && c.ReceiverId == loggedInUser.Id))
                .OrderBy(c => c.DateSent)
                .ToListAsync();

            var chatMessageDtos = new List<ChatMessageDto>();
            foreach(var chatMessage in chatMessages) {
                chatMessageDtos.Add(new ChatMessageDto {
                    Id = chatMessage.Id,
                    SenderUsername = chatMessage.SenderId == loggedInUser.Id ? loggedInUser.UserName : chatPartner.UserName,
                    ReceiverUsername = chatMessage.ReceiverId == loggedInUser.Id ? loggedInUser.UserName : chatPartner.UserName,
                    Content = chatMessage.Content,
                    DateSent = chatMessage.DateSent,
                    Status = chatMessage.Status
                });
            }

            return chatMessageDtos;

        }

    }
}
