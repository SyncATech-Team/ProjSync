
using backAPI.Entities.Domain;

namespace backAPI.DTO.Chat {

    public class ChatMessageDto {
            
        public int Id { get; set; }
        public string SenderUsername { get; set; }
        public string ReceiverUsername { get; set; }
        public string Content { get; set; }
        public DateTime DateSent { get; set; }
        public MessageStatus Status { get; set; }
    }

}