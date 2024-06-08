import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { JIssue } from '../../../../_models/issue';
import { FormControl } from '@angular/forms';
import {ProjectService} from "../../../state/project/project.service";

@Component({
  selector: 'issue-title',
  templateUrl: './issue-title.component.html',
  styleUrl: './issue-title.component.css'
})
export class IssueTitleComponent implements OnChanges {
  @Input() issue!: JIssue;
  @Input() canManageTask!: string;

  titleControl!: FormControl;

  constructor(private _projectService: ProjectService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const issueChange = changes['issue'];
    if (issueChange.currentValue !== issueChange.previousValue) {
      this.titleControl = new FormControl(this.issue.title);
    }
  }

  onBlur() {
    // pozovi servis samo ako neko moze da menja zadatke
    if (this.canManageTask === 'True') {

      this._projectService.updateIssue({

        ...this.issue,
        title: this.titleControl.value
      }, this.issue.title);

    } else {
      
      return;
    }
  }
}
