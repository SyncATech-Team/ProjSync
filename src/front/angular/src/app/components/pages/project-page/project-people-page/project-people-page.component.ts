import { Component, OnInit } from '@angular/core';
import { UserGetter } from '../../../../_models/user-getter';
import { ActivatedRoute } from '@angular/router';
import { UserOnProjectService } from '../../../../_service/userOnProject.service';

@Component({
  selector: 'app-project-people-page',
  templateUrl: './project-people-page.component.html',
  styleUrl: './project-people-page.component.css'
})
export class ProjectPeoplePageComponent implements OnInit{
  users: UserGetter[] = [];
  projectName: string = '';

  constructor(private route: ActivatedRoute, private userOnProjectService: UserOnProjectService) {}


  ngOnInit(): void {
    this.projectName = this.route.snapshot.paramMap.get('projectName')!;
    this.initialize();
  }

  initialize(): void {
    this.userOnProjectService.getAllUsersOnProject(this.projectName).subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
