import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserOnProjectService } from '../../../_service/userOnProject.service';
import { UserGetter } from '../../../_models/user-getter';


@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.css'
})

export class ProjectPageComponent implements OnInit {

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

  test(){
    console.log(this.users);
  }
}
