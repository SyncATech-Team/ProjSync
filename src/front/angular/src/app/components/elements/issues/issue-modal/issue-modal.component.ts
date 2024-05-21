import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { JIssue } from '../../../../_models/issue';
import {PhotoForUser} from "../../../../_models/photo-for-user";

@Component({
  selector: 'issue-modal',
  templateUrl: './issue-modal.component.html',
  styleUrl: './issue-modal.component.css'
})
export class IssueModalComponent implements OnInit {
  issue$!: Observable<JIssue>;
  usersPhotos!: PhotoForUser[];

  constructor(private _modal: DynamicDialogRef, private _dialogConfig: DynamicDialogConfig) {
  }

  ngOnInit(): void {
    this.issue$ = this._dialogConfig.data.issue$;
    this.usersPhotos! = this._dialogConfig.data.usersPhotos;
  }

  closeModal() {
    this._modal.close("deleted-task");
  }

}
