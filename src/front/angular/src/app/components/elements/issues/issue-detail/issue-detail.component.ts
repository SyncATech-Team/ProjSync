import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JIssue} from '../../../../_models/issue';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ProjectService} from "../../../state/project/project.service";
import {ProjectQuery} from "../../../state/project/project.query";
import {PhotoForUser} from "../../../../_models/photo-for-user";
import { DocumentTitle } from '../../../../_models/document-title.model';
import { AccountService } from '../../../../_service/account.service';
import { TranslateService } from '@ngx-translate/core';
import { IssueUtil } from '../../../utils/issue-util';

@Component({
  selector: 'issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrl: './issue-detail.component.css'
})
export class IssueDetailComponent implements OnInit{
  @Input() issue!: JIssue | null;
  @Input() isShowFullScreenButton!: boolean;
  @Input() isShowCloseButton!: boolean;
  @Output() onClosed = new EventEmitter();
  @Output() onOpenIssue = new EventEmitter<string>();
  @Input() usersPhotos!: PhotoForUser[];

  documentTitles: DocumentTitle[] = [];
  documentTitlesBackup: DocumentTitle[] = [];
  permission: any;
  canManageTask: string = '';

  constructor(
    public accountService: AccountService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public projectQuery: ProjectQuery,
    private _projectService: ProjectService,
    private translateService: TranslateService
  ) {
  }
  ngOnInit(): void {
    var user = this.accountService.getCurrentUser();

    if(user?.permitions) {

      this.permission = user.permitions;
      this.canManageTask = user.permitions.canManageTasks;
    }
  }

  closeModal() {
    this.onClosed.emit();
  }

  // dialog za brisanje
  confirmDelete(event: Event) {
    this.translateService.get([
      'general.do-you-want-to-delete-this-record',
      'general.delete-confirmation'
    ]).subscribe((res: any) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: res['general.do-you-want-to-delete-this-record'],
        header: res['general.delete-confirmation'],
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
          // this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
        }
      });
    });
  }

  get selectedIssueTypeIcon(): string {
    if (!this.issue) return '';
    return IssueUtil.getIssueTypeIcon(this.issue.type);
  }
}
