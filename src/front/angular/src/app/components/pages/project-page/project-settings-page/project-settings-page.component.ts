import { Component, OnInit } from '@angular/core';
import { Project } from '../../../../_models/project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../../_service/project.service';
import { MessagePopupService } from '../../../../_service/message-popup.service';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ProjectType } from '../../../../_models/project-type';
import { ProjectTypeService } from '../../../../_service/project-type.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserGetter } from '../../../../_models/user-getter';
import { UserProfilePicture } from '../../../../_service/userProfilePicture.service';
import { PhotoForUser } from '../../../../_models/photo-for-user';
import { UserOnProjectService } from '../../../../_service/userOnProject.service';

@Component({
  selector: 'app-project-settings-page',
  templateUrl: './project-settings-page.component.html',
  styleUrl: './project-settings-page.component.css'
})
export class ProjectSettingsPageComponent implements OnInit {
  
  form : FormGroup;
  projectName: string | null = '';

  //Za ispis u input poljima default-no
  projectName2: string | null = '';
  projectType2: string | null = '';
  projectDescription2: string | null = '';

  projectTypes: ProjectType []=[];

  project: Project = {
    name: "",
    key: "",
    typeName: "",
    description: "",
    ownerUsername: "",
    creationDate: new Date(), 
    dueDate: new Date(),
    budget: 0,
    visibilityName: ""
  }

  users: UserGetter[] = [];
  usersPhotos: PhotoForUser[] = [];
  transferToUser: string='';

  constructor (
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router:Router,
    private msgPopupService: MessagePopupService,
    private formBuilder: FormBuilder,
    private projectTypeService: ProjectTypeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userPictureService: UserProfilePicture,
    private usersOnProject: UserOnProjectService){
    this.projectName = route.snapshot.paramMap.get('projectName');
    this.form = this.formBuilder.group({
      name: [''],
      category: [''],
      description: ['']
    });

    this.projectTypeService.getAllProjectTypes().subscribe({
      next: (response)=>{
        this.projectTypes = response;
      },
      error: (error)=>{
        console.log(error);
      }
    });
  }

  ngOnInit(): void {
    this.projectService.getProjectByName(this.projectName).subscribe({
      next: (response)=>{
        this.project= response;

        //Za ispis u input poljima default-no
        this.projectName2 = this.project.name;
        this.projectType2 = this.project.typeName;
        this.projectDescription2 = this.project.description;

        this.form.patchValue({
          category: this.projectTypes.find(type => type.name === this.project.typeName)
        });
      },
      error: (error)=>{
        console.log(error);
      }
    });
    if(this.projectName)
    {
      this.usersOnProject.getAllUsersOnProjectThatCanManageProject(this.projectName).subscribe({
        next: (response) => {
          this.users = response.filter(user => user.username != this.project.ownerUsername);
          this.getUserProfilePhotos(this.users);
        }
      });
    }
    
  }

  onSubmit() {
    this.project.name = this.form.value.name;
    // this.project.typeName = this.form.value.category.name;
    
    console.log(this.form.value.category.name);
    console.log(this.project.typeName);
    if(this.projectName!=this.project.name || this.form.value.description != this.project.description || this.form.value.category.name != this.project.typeName){
      this.project.description = this.form.value.description;
      this.project.typeName = this.form.value.category.name;

      this.projectService.updateProject(this.projectName!,this.project).subscribe({
        next:(response)=>{
            this.router.navigate(["home/projects/settings/"+this.project.name]);
            this.projectName=this.project.name;
            this.msgPopupService.showSuccess("Project edited");
          },
          error: (error)=>{
            console.log(error);
            this.msgPopupService.showError("Project name failed to update");
          }
        });
    }
  }

  openPopUp(event : any){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to deactivate this project?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm rounded',
      accept: () => {
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Project deactivated', life: 3000 });
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
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
            this.usersPhotos.push(ph);
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
        this.usersPhotos.push(ph);
      }
    }
  }

  getUserImagePath(username: string,users: UserGetter[]) {
    let index = users.findIndex(u => u.username === username);
    if(index == -1) return this.userPictureService.getFirstDefaultImagePath();

    if(users[index].profilePhoto == null)
      return this.userPictureService.getDefaultImageForUser(users[index].username);

    let ind = this.usersPhotos.findIndex(u => u.username == username);
    if(ind == -1) return this.userPictureService.getFirstDefaultImagePath();
    return this.usersPhotos[ind].photoSource;
  }

  transfer(){
    this.projectService.transferProject(this.project.name,this.transferToUser).subscribe({
      next: (response) => {
        
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
