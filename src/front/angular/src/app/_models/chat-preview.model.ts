export interface ChatPreview {
    conversationPartnerId: number;
    conversationPartnerUsername: string;
    conversationPartnerName: string;
    conversationPartnerPhoto: string;
    lastMessage: string;
    dateCreated: Date;
    numberOfUnreadMessages: number;
}