import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { JIssue } from '../../../../_models/issue';
import { FormControl } from '@angular/forms';
import { quillConfiguration } from '../../../config/editor';

@Component({
  selector: 'issue-description',
  templateUrl: './issue-description.component.html',
  styleUrl: './issue-description.component.css'
})
export class IssueDescriptionComponent implements OnChanges {
  @Input() issue!: JIssue;
  descriptionControl!: FormControl;
  editorOptions = quillConfiguration;
  isEditing!: boolean;
  isWorking!: boolean;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const issueChange = changes['issue'];
    if (issueChange.currentValue !== issueChange.previousValue) {
      this.descriptionControl = new FormControl(this.issue.description);
    }
  }

  setEditMode(mode: boolean) {
    this.isEditing = mode;
  }

  editorCreated(editor: any) {
    if (editor && editor.focus) {
      editor.focus();
    }
  }

  save() {
    // this._projectService.updateIssue({
    //   ...this.issue,
    //   description: this.descriptionControl.value
    // });
    // this.setEditMode(false);
  }

  cancel() {
    this.descriptionControl.patchValue(this.issue.description);
    this.setEditMode(false);
  }
}
