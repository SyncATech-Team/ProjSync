import {Component, EventEmitter, Input, Output} from '@angular/core';
import {JIssue} from '../../../../_models/issue';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ProjectService} from "../../../state/project/project.service";
import {ProjectQuery} from "../../../state/project/project.query";

@Component({
  selector: 'issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrl: './issue-detail.component.css'
})
export class IssueDetailComponent {
  @Input() issue!: JIssue | null;
  @Input() isShowFullScreenButton!: boolean;
  @Input() isShowCloseButton!: boolean;
  @Output() onClosed = new EventEmitter();
  @Output() onOpenIssue = new EventEmitter<string>();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public projectQuery: ProjectQuery,
    private _projectService: ProjectService) {
  }

  closeModal() {
    this.onClosed.emit();
  }

  // dialog za brisanje
  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        if (!this.issue) return;
        this._projectService.deleteIssue(this.issue.id);
        this.closeModal();
      },
      reject: () => {
        this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
      }
    });
  }

  openIssuePage() {
    if (!this.issue) return;
    this.onOpenIssue.emit(this.issue.id);
  }
}
