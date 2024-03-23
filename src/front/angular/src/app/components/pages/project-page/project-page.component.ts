import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.css'
})
export class ProjectPageComponent {
  

  constructor(private route: ActivatedRoute) {
    console.log("Constructor " + this.route.snapshot.paramMap.get('projectName'));
  }
}
