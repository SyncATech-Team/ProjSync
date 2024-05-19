
using backAPI.Entities.Domain;

namespace backAPI.DTO.Chat {

    public class ChatMessageDto {
            
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; }
        public DateTime DateSent { get; set; }
        public MessageStatus Status { get; set; }
    }

}