import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../_service/chat.service';

@Component({
  selector: 'app-chat-element',
  templateUrl: './chat-element.component.html',
  styleUrl: './chat-element.component.css'
})
export class ChatElementComponent implements OnInit {

  private static unreadMessages: number = 0;

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.chatService.getUnreadMessages().subscribe({
      next: response => {
        ChatElementComponent.unreadMessages = response;
        ChatElementComponent.ChangeNumberOfUnreadMessagesUI(ChatElementComponent.unreadMessages);
      },
      error: error => {
        console.log("ERROR: " + error.error);
        ChatElementComponent.unreadMessages = 0;
        ChatElementComponent.ChangeNumberOfUnreadMessagesUI(ChatElementComponent.unreadMessages);
      }
    })
  }

  public static increaseNumberOfUnreadMessages(): void {
    this.unreadMessages = this.unreadMessages + 1;
    this.ChangeNumberOfUnreadMessagesUI(this.unreadMessages);
  }

  public static decreaseNumberOfUnreadMessages(num?: number): void {
    if(num) {
      this.unreadMessages = this.unreadMessages - num;
    }
    else {
      this.unreadMessages = this.unreadMessages - 1;
    }
    this.ChangeNumberOfUnreadMessagesUI(this.unreadMessages);
  }

  public static resetoToZero(): void {
    this.unreadMessages = 0;
    this.ChangeNumberOfUnreadMessagesUI(this.unreadMessages);
  }

  public static getNumberOfUnreadMessages(): number {
    return this.unreadMessages;
  }

  private static ChangeNumberOfUnreadMessagesUI(value: number) {
    let element = document.getElementById("number-of-unread-messages-span");
    let badgeDiv = document.getElementById("badge-div-chat");
    let valueToInsert = (value <= 99) ? "" + value : "99+";

    if(badgeDiv?.classList.contains("badge-pulse-chat")) badgeDiv?.classList.remove("badge-pulse-chat");
    if(value > 0) { badgeDiv?.classList.add("badge-pulse-chat"); }

    if(element) {
      element.innerHTML = valueToInsert;

      if(badgeDiv!.classList.contains("badgecolor-blue")) badgeDiv!.classList.remove("badgecolor-blue");
      if(badgeDiv!.classList.contains("badgecolor-yellow")) badgeDiv!.classList.remove("badgecolor-yellow");
      if(badgeDiv!.classList.contains("badgecolor-red")) badgeDiv!.classList.remove("badgecolor-red");

      if(this.unreadMessages < 5) {
        badgeDiv!.classList.add("badgecolor-blue");
      }
      else if(this.unreadMessages < 10) {
        badgeDiv!.classList.add("badgecolor-yellow");
      }
      else {
        badgeDiv!.classList.add("badgecolor-red");
      }
    }
  }

}
