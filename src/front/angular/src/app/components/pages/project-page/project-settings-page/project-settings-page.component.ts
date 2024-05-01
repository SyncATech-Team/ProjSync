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
import { ProjectSidebarComponent } from '../../../elements/project-sidebar/project-sidebar.component';
import { error } from 'console';
import { AccountService } from '../../../../_service/account.service';
import { User } from '../../../../_models/user';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-settings-page',
  templateUrl: './project-settings-page.component.html',
  styleUrl: './project-settings-page.component.css'
})
export class ProjectSettingsPageComponent implements OnInit {
  index : number = 1;
  visible: boolean = false;
  iconIndexes: number[] = Array.from({length: 26}, (_, i) => i + 1); //NIZ SLIKA ZA PROJEKTE
  projectImageSource : string = "";
  defaultImagePath : string = "../../../../../assets/project-icon/default_project_image.png";

  form : FormGroup;
  projectName: string | null = '';
  projectOwnerUsername: string | null = '';
  //Za ispis u input poljima default-no
  projectName2: string | null = '';
  projectType2: string | null = '';
  projectDescription2: string | null = '';
  startDate2: string | null = '';
  dueDate2: string | null = '';

  projectTypes: ProjectType []=[];

  project: Project = {
    name: "",
    key: "",
    typeName: "",
    description: "",
    ownerUsername: "",
    icon: "",
    creationDate: new Date(), 
    dueDate: new Date(),
    budget: 0,
    visibilityName: ""
  }

  loggedUser: User | null= null;
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
    private sideBarComponent: ProjectSidebarComponent,
    private userPictureService: UserProfilePicture,
    private usersOnProject: UserOnProjectService,
    private datePipe: DatePipe,
    private accountService: AccountService){
    this.projectName = route.snapshot.paramMap.get('projectName');
    this.form = this.formBuilder.group({
      name: [''],
      category: [''],
      description: [''],
      startDate: [''],
      dueDate: ['']
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
        this.projectImageSource = this.project.icon!;
        //Za ispis u input poljima default-no
        this.projectName2 = this.project.name;
        this.projectType2 = this.project.typeName;
        this.projectDescription2 = this.project.description;
        this.startDate2 = this.datePipe.transform(this.project.creationDate, "yyyy-MM-dd");
        this.dueDate2 = this.datePipe.transform(this.project.dueDate, "yyyy-MM-dd");
        this.projectOwnerUsername = this.project.ownerUsername;
        
        this.loggedUser = this.accountService.getCurrentUser();

        this.usersOnProject.getAllUsersOnProjectThatCanManageProject(this.projectName!).subscribe({
          next: (response) => {
            this.users = response.filter(user => user.username != this.projectOwnerUsername);
            this.getUserProfilePhotos(this.users);
          }
        });

        this.form.patchValue({
          category: this.projectTypes.find(type => type.name === this.project.typeName)
        });
      },
      error: (error)=>{
        console.log(error);
      }
    });
    
  }

  onSubmit() {
    this.project.name = this.form.value.name;
    // this.project.typeName = this.form.value.category.name;
    
    console.log(this.form.value.category.name);
    console.log(this.project.typeName);
    if(this.projectName!=this.project.name || this.form.value.description != this.project.description || this.form.value.category.name != this.project.typeName
       || this.form.value.startDate != this.project.creationDate || this.form.value.dueDate != this.project.dueDate 
    ){

      if(this.form.value.startDate > this.form.value.dueDate){
        this.msgPopupService.showError("Due date can\'t be before starting date");
        return;
      }
      var DueDateFormated = new Date(this.form.value.dueDate); //radi provere da li je due date pre danasnjeg dana
      var currentDate = new Date(); //isto
      if(DueDateFormated < currentDate){
        this.msgPopupService.showError("Due date can\'t be before today");
        return;
      }
      
      this.project.description = this.form.value.description;
      this.project.typeName = this.form.value.category.name;
      this.project.creationDate = this.form.value.startDate;
      this.project.dueDate = this.form.value.dueDate;
      console.log("uspesno")
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
        this.router.navigate(["home"]);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  showDialog() {
    this.visible = true;
  }

  getAllIconsForProject(index: number){
    return `../../../../../assets/project-icon/image${index}.png`;
  }

  setProjectImage(event : any){
    const imageUrl = event.target.src;
    const relativeImageUrl = imageUrl.substring(imageUrl.indexOf('/assets'));
    this.projectImageSource = relativeImageUrl;
    this.project.icon = this.projectImageSource;
    console.log(this.project);  

    if(this.projectName){
      this.projectService.updateProject(this.projectName, this.project).subscribe({
        next: (response) => {
          this.sideBarComponent.setProjectPicture(this.projectImageSource);
        },
        error: (error) => {
          console.log(error);
        } 
      });
    }
    //Zatvori modal
    this.visible = false; 
  }
}
