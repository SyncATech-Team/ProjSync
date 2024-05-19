namespace backAPI.DTO.Chat {
    public class ChatPreviewDto {

        public int ConversationPartnerId { get; set; }
        public string ConversationPartnerUsername { get; set; }
        public string ConversationPartnerName { get; set; }
        public string ConversationPartnerPhoto { get; set; }
        public string LastMessage { get; set; }
        public DateTime DateCreated { get; set; }

    }
}
