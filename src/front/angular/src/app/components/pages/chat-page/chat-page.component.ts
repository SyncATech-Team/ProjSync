import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserGetter } from '../../../_models/user-getter';
import { PhotoForUser } from '../../../_models/photo-for-user';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';
import { UserService } from '../../../_service/user.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent implements OnInit, AfterViewInit {

  usersForChat: UserGetter[] = [];
  usersForChatPhotos: PhotoForUser[] = [];
  selectedUser?: UserGetter = undefined;
  filteredUsers: UserGetter[] = [];

  constructor(
    private userPictureService: UserProfilePicture,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.fetchUsersForChat();
  }

  ngAfterViewInit() {
    this.scrollToTheLatestMessage();
  }

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

  scrollToTheLatestMessage() {
    let element = document.getElementById('messages-div-id') as HTMLElement;
    element.scrollTop = element.scrollHeight;
  }

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

  fetchUsersForChat() {
    this.userService.getAllUsers().subscribe(users => {
      this.usersForChat = users.filter(user => user.companyRoleName !== 'Administrator');
      this.getUserProfilePhotos(this.usersForChat);
    });
  }

  getUserImagePath(username: string,users: UserGetter[]) {
    let index = users.findIndex(u => u.username === username);
    if(index == -1) return this.userPictureService.getFirstDefaultImagePath();

    if(users[index].profilePhoto == null)
      return this.userPictureService.getDefaultImageForUser(users[index].username);

    let ind = this.usersForChatPhotos.findIndex(u => u.username == username);
    if(ind == -1) return this.userPictureService.getFirstDefaultImagePath();
    return this.usersForChatPhotos[ind].photoSource;
  }

}
