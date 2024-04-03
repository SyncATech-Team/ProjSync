import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { JIssue } from '../../../../_models/issue';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'issue-title',
  templateUrl: './issue-title.component.html',
  styleUrl: './issue-title.component.css'
})
export class IssueTitleComponent implements OnChanges {
  @Input() issue!: JIssue;
  titleControl!: FormControl;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const issueChange = changes['issue'];
    if (issueChange.currentValue !== issueChange.previousValue) {
      this.titleControl = new FormControl(this.issue.title);
    }
  }

  onBlur() {
    // this._projectService.updateIssue({
    //   ...this.issue,
    //   title: this.titleControl.value
    // });
  }
}
