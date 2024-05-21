import { Component, OnInit } from '@angular/core';
import { UserGetter } from '../../../_models/user-getter';
import { PhotoForUser } from '../../../_models/photo-for-user';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';
import { UserService } from '../../../_service/user.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ChatService } from '../../../_service/chat.service';
import { AccountService } from '../../../_service/account.service';
import { User } from '../../../_models/user';
import { ChatPreview } from '../../../_models/chat-preview.model';
import { PresenceService } from '../../../_service/presence.service';
import { MessageSendDto } from '../../../_models/message-send.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent implements OnInit {

  usersForChat: UserGetter[] = [];
  filteredUsers: UserGetter[] = [];
  usersForChatPhotos: PhotoForUser[] = [];
  
  loggedInUser: User | null = null;
  selectedUser?: UserGetter = undefined;
  selectedUserUsername: string = "";

  previousChats: ChatPreview[] = [];

  inputMessage: string = "";
  message: MessageSendDto = {
    senderUsername: "",
    receiverUsername: "",
    content: "",
    dateSent: new Date(),
    status: 0
  };

  messages: MessageSendDto[] = [];

  showChat: boolean = false;

  constructor(
    // private router: Router,
    private userPictureService: UserProfilePicture,
    private userService: UserService,
    private chatService: ChatService,
    private accountService: AccountService,
    public presenceService: PresenceService,
    // private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {

    this.setLoggedInUser();
    this.setUsersPreviousChats();
    this.fetchUsersForChat();

    // this.route.queryParams.pipe().subscribe(params => {
    //   let username = params['username'];
    //   if(username != null) {
    //     this.showChat = true;
    //     this.selectedUserUsername = username;
    //   }
    // });
  }

  /**
   * Sets the logged-in user by retrieving the current user from the account service.
   */
  setLoggedInUser() {
    this.loggedInUser = this.accountService.getCurrentUser();
  }

  /**
   * Sets the previous chats for the logged-in user.
   */
  setUsersPreviousChats() {
    this.chatService.getUsersPreviousChats("" + this.loggedInUser!.id).subscribe({
      next: response => {
        this.previousChats = response.sort((a, b) => {
          if(a.dateCreated > b.dateCreated) return -1;
          if(a.dateCreated < b.dateCreated) return 1;
          return 0;
        });
      },
      error: error => {
        console.log(error);
      }
    });
  }

  /**
   * Gets the previous chats.
   * @returns An array of previous chats.
   */
  get getPreviousChats() {
    return this.previousChats;
  }

  /**
   * Searches for users based on the provided query and updates the filteredUsers array.
   * @param event - The AutoCompleteCompleteEvent object containing the query.
   */
  searchUsers(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.usersForChat as any[]).length; i++) {
        let user = (this.usersForChat as any[])[i];
        if (user.username.toLowerCase().indexOf(query.toLowerCase()) != -1) {
            filtered.push(user);
        }
    }

    this.filteredUsers = filtered;
  }

  /**
   * Handles the event when a user is selected.
   * @param event - The event object containing the selected user information.
   */
  onUserSelected(event: any) {
    console.log(event);
    if(event == null) this.showChat = false;
    else {
      if(this.usersForChatPhotos.filter(u => u.username == event.username).length != 0) {
        this.showChat = true;
        // this.router.navigate([], {queryParams: {username: event.username}});
        this.setMessages(this.loggedInUser!.username, event.username);
      }
    }
  }

  /**
   * Sets the messages for the chat page.
   * 
   * @param loggedInUserUsername - The username of the logged in user.
   * @param otherUserUsername - The username of the other user.
   */
  setMessages(loggedInUserUsername: string, otherUserUsername: string) {
    this.chatService.getMessages(loggedInUserUsername, otherUserUsername).subscribe({
      next: response => {
        this.messages = response;
        setTimeout(() => {
          this.scrollToTheLatestMessage();
        }, 0);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  /**
   * Scrolls to the latest message in the chat.
   */
  scrollToTheLatestMessage() {
    let element = document.getElementById('messages-div-id') as HTMLElement;
    element.scrollTop = element.scrollHeight;
  }

  /**
   * Retrieves user profile photos and adds them to the usersForChatPhotos array.
   * @param users - An array of UserGetter objects.
   */
  getUserProfilePhotos(users: UserGetter[]) {
    for(const user of users) {
      if(user.profilePhoto != null) {
        this.userPictureService.getUserImage(user.username).subscribe({
          next: response => {
            let path = response['fileContents'];
            path = this.userPictureService.decodeBase64Image(response['fileContents']);
            var ph: PhotoForUser = {
              username: user.username, 
              photoSource: path
            };
            this.usersForChatPhotos.push(ph);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      else {
        var ph: PhotoForUser = {
          username: user.username,
          photoSource: "SLIKA_JE_NULL"
        }
        this.usersForChatPhotos.push(ph);
      }
    }
  }

  /**
   * Fetches users for chat and performs necessary operations based on the retrieved data.
   */
  fetchUsersForChat() {
    this.userService.getAllUsers().subscribe(users => {
      this.usersForChat = users.filter(user => user.companyRoleName !== 'Administrator');
      this.getUserProfilePhotos(this.usersForChat);
      
      if(this.selectedUserUsername != "") {
        let index = this.usersForChat.findIndex(u => u.username == this.selectedUserUsername);
        if(index != -1) {
          this.selectedUser = this.usersForChat[index];
          this.showChat = true;
          this.setMessages(this.loggedInUser!.username, this.selectedUserUsername);
        }
      }

    });
  }

  /**
   * Retrieves the image path for a given user.
   * @param username - The username of the user.
   * @param users - An array of UserGetter objects.
   * @returns The image path for the user.
   */
  getUserImagePath(username: string,users: UserGetter[]) {
    let index = users.findIndex(u => u.username === username);
    if(index == -1) return this.userPictureService.getFirstDefaultImagePath();

    if(users[index].profilePhoto == null)
      return this.userPictureService.getDefaultImageForUser(users[index].username);

    let ind = this.usersForChatPhotos.findIndex(u => u.username == username);
    if(ind == -1) return this.userPictureService.getFirstDefaultImagePath();
    return this.usersForChatPhotos[ind].photoSource;
  }

  /**
   * Returns the trimmed content of a message.
   * If the message length is greater than 30 characters, it will be trimmed and appended with "...".
   * @param message - The message to be trimmed.
   * @returns The trimmed message content.
   */
  getTrimmedMessageContent(message: string) {
    return message.length > 30 ? message.substring(0, 30) + "..." : message;
  }

  /**
   * Sends a message to the selected user.
   */
  sendMessage() {

    if(this.inputMessage == "") return; // If the input message is empty, return.

    this.message!.senderUsername = this.loggedInUser!.username;
    this.message!.receiverUsername = this.selectedUser!.username;
    this.message!.content = this.inputMessage;
    this.message!.dateSent = new Date();
    this.message!.status = 0;

    this.chatService.sendMessage(this.message!).subscribe({
      next: response => {
        this.messages.push(this.message!);  // Add the message to the messages array.
        this.inputMessage = "";             // Clear the input message.
        setTimeout(() => {                  // Scroll to the latest message.
          this.scrollToTheLatestMessage();
        }, 0);
      },
      error: error => {
        console.log(error);
      }
    });

  }

}
