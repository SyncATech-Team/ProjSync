import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { JIssue } from '../../../../_models/issue';

@Component({
  selector: 'issue-modal',
  templateUrl: './issue-modal.component.html',
  styleUrl: './issue-modal.component.css'
})
export class IssueModalComponent implements OnInit {
  issue$!: Observable<JIssue>;

  constructor(private _modal: DynamicDialogRef, private _dialogConfig: DynamicDialogConfig) {
  }

  ngOnInit(): void {
    this.issue$ = this._dialogConfig.data.issue$;
  }

  closeModal() {
    this._modal.close();
  }

}
