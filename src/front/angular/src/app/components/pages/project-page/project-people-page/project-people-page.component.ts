import { Component, OnInit } from '@angular/core';
import { UserGetter } from '../../../../_models/user-getter';
import { ActivatedRoute } from '@angular/router';
import { UserOnProjectService } from '../../../../_service/userOnProject.service';
import { CompanyroleService } from '../../../../_service/companyrole.service';
import { CompanyRole } from '../../../../_models/company-role';

@Component({
  selector: 'app-project-people-page',
  templateUrl: './project-people-page.component.html',
  styleUrls: ['./project-people-page.component.css']
})
export class ProjectPeoplePageComponent implements OnInit{
  private MAX_NUMBER_OF_DEFAULT_IMAGES: number = 10;
  users: UserGetter[] = [];
  users_backup : UserGetter[] = [];
  userRole : CompanyRole[] = [];
  userRoleName: string[] = [];
    
  projectName: string = '';
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute, 
    private userOnProjectService: UserOnProjectService, 
    private companyRole: CompanyroleService 
  ) {}

  ngOnInit(): void {
    this.projectName = this.route.snapshot.paramMap.get('projectName')!;
    this.initialize();
  }

  initialize(): void {
    this.userOnProjectService.getAllUsersOnProject(this.projectName).subscribe({
      next: (response) => {
        this.users = response;
        this.users_backup = response;
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.companyRole.getAllCompanyRoleNames().subscribe({
      next: (response) => {
        this.userRole = response;
        this.userRoleName = this.userRole.map(role => role.name);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getUserImagePath(username: string) {
    let usernameSumOfCharacters: number = 0;
    for (let index = 0; index < username.length; index++) {
      usernameSumOfCharacters += username.charCodeAt(index);
    }

    let defaultImageNumber = usernameSumOfCharacters % this.MAX_NUMBER_OF_DEFAULT_IMAGES + 1;
    let path: string = "../../../../../assets/images/DefaultAccountProfileImages/default_account_image_" + defaultImageNumber + ".png";

    return path;
  }

  search() {
    let searchTerm = this.searchTerm.toLowerCase();
    if (searchTerm.trim() === '') {
      this.users = [...this.users_backup];
    } else {
      this.users = this.users_backup.filter(user => user.username.toLowerCase().includes(searchTerm));
      console.log(this.userRoleName);
    }
  }
}
