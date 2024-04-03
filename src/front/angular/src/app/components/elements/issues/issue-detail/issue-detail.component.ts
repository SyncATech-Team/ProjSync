import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JIssue } from '../../../../_models/issue';

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
 //  @Output() onOpenIssue = new EventEmitter<string>();
  // @Output() onDelete = new EventEmitter<DeleteIssueModel>();

  closeModal() {
    this.onClosed.emit();
  }

  openDeleteIssueModal() {
    // this._modalService.create({
    //   nzContent: IssueDeleteModalComponent,
    //   nzClosable: false,
    //   nzFooter: null,
    //   nzStyle: {
    //     top: '140px'
    //   },
    //   nzComponentParams: {
    //     issueId: this.issue.id,
    //     onDelete: this.onDelete
    //   }
    // });
  }

  openIssuePage() {
    // this.onOpenIssue.emit(this.issue.id);
  }
}
