import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../state/project/project.service";


@Component({
  selector: 'app-samotest',
  templateUrl: './samotest.component.html',
  styleUrl: './samotest.component.css'
})
export class SamotestComponent implements OnInit {

  constructor(private _projectService: ProjectService) {
  }

  ngOnInit(): void {
    this._projectService.getProject();
  }
}
