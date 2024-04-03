import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../../../_models/project.model';
import { ProjectService } from '../../../../_service/project.service';

@Component({
  selector: 'app-project-summary-page',
  templateUrl: './project-summary-page.component.html',
  styleUrl: './project-summary-page.component.css'
})
export class ProjectSummaryPageComponent implements OnInit{
  private MAX_NUMBER_OF_DEFAULT_IMAGES: number = 10;
  projectName: string | null = '';
  projectType: string = '';
  projectKey: string = '';
  isLoading: boolean = true;
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

  constructor (private route: ActivatedRoute,private projectService: ProjectService){
    this.projectName = route.snapshot.paramMap.get('projectName');
  }
  ngOnInit(): void {
    this.projectService.getProjectByName(this.projectName).subscribe({
      next: (response)=>{
        this.project= response;
        this.projectType = this.project.typeName;
        this.projectKey = this.project.key;
        this.isLoading = false; 
      },
      error: (error)=>{
        console.log(error);
      }
    });

  }

  getDefaultImagePath(): string {
    // let x: number = this.getRandomInteger(1, 10);
    let x: number = 1;
    let path: string = "../../../../../assets/images/DefaultAccountProfileImages/default_account_image_" + x + ".png";
    
    // console.log(path);

    return path;
  }
  getUserImagePath(username: string) {
    var user = this.project.ownerUsername;
    let path = "";

    if(this.project.ownerProfilePhoto == null) {
      let usernameSumOfCharacters: number = 0;
      for (let index = 0; index < username.length; index++) {
        usernameSumOfCharacters += username.charCodeAt(index);
      }

      let defaultImageNumber = usernameSumOfCharacters % this.MAX_NUMBER_OF_DEFAULT_IMAGES + 1;
      path = "../../../../../assets/images/DefaultAccountProfileImages/default_account_image_" 
          + defaultImageNumber + ".png";
    }
    else {
      path = "../../../../../assets/images/UserProfileImages/" + this.project.ownerProfilePhoto;
    }
    return path;
  }

}
