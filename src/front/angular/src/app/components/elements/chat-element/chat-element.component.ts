import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../_service/chat.service';

@Component({
  selector: 'app-chat-element',
  templateUrl: './chat-element.component.html',
  styleUrl: './chat-element.component.css'
})
export class ChatElementComponent implements OnInit {

  private static _unreadMessages: number = 0;

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.chatService.getUnreadMessages().subscribe({
      next: response => {
        ChatElementComponent._unreadMessages = response;
        ChatElementComponent.ChangeNumberOfUnreadMessagesUI(ChatElementComponent._unreadMessages);
      },
      error: error => {
        console.log("ERROR: " + error.error);
        ChatElementComponent._unreadMessages = 0;
        ChatElementComponent.ChangeNumberOfUnreadMessagesUI(ChatElementComponent._unreadMessages);
      }
    })
  }

  public static increaseNumberOfUnreadMessages(): void {
    this._unreadMessages = this._unreadMessages + 1;
    this.ChangeNumberOfUnreadMessagesUI(this._unreadMessages);
  }

  public static decreaseNumberOfUnreadMessages(num?: number): void {
    if(num) {
      this._unreadMessages = this._unreadMessages - num;
    }
    else {
      this._unreadMessages = this._unreadMessages - 1;
    }
    this.ChangeNumberOfUnreadMessagesUI(this._unreadMessages);
  }

  public static resetoToZero(): void {
    this._unreadMessages = 0;
    this.ChangeNumberOfUnreadMessagesUI(this._unreadMessages);
  }

  public static getNumberOfUnreadMessages(): number {
    return this._unreadMessages;
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

      if(this._unreadMessages < 5) {
        badgeDiv!.classList.add("badgecolor-blue");
      }
      else if(this._unreadMessages < 10) {
        badgeDiv!.classList.add("badgecolor-yellow");
      }
      else {
        badgeDiv!.classList.add("badgecolor-red");
      }
    }
  }

  public get unreadMessages(): number {
    return ChatElementComponent._unreadMessages;
  }
  public set unreadMessages(value: number) {
    ChatElementComponent._unreadMessages = value;
  }

}
