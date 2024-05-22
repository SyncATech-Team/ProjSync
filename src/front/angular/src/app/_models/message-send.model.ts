
export interface MessageSendDto {
    senderUsername: string;
    receiverUsername: string;
    content: string;
    dateSent: Date;
    status: number;
}