using System.ComponentModel.DataAnnotations.Schema;

namespace backAPI.Entities.Domain {

    public enum MessageStatus {
        SENT, READ
    };

    public class ChatMessage {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; }
        public DateTime DateSent { get; set; }
        public MessageStatus Status { get; set; }


        [ForeignKey("SenderId")] public User UserSender { get; set; }
        [ForeignKey("ReceiverId")] public User ReceiverUser { get; set; }
    }
}
