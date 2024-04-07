import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IssueStatus, IssueStatusDisplay, JIssue } from '../../../../_models/issue';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {Observable, map, combineLatest} from 'rxjs';
import {ProjectService} from "../../../state/project/project.service";
import {FilterQuery} from "../../../state/filter/filter.query";
import {FilterState} from "../../../state/filter/filter.store";
import {IssueUtil} from "../../../utils/issue-util";

@Component({
  selector: '[board-dnd-list]',
  templateUrl: './board-dnd-list.component.html',
  styleUrl: './board-dnd-list.component.css',
  encapsulation: ViewEncapsulation.None
})
@UntilDestroy()
export class BoardDndListComponent implements OnInit {
  @Input() status!: IssueStatus;
  @Input() currentUserId!: string;
  @Input() issues$!: Observable<JIssue[]>;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  IssueStatusDisplay = IssueStatusDisplay;
  issues: JIssue[] = [];

  constructor(private _projectService: ProjectService, private _filterQuery: FilterQuery) {
  }

  ngOnInit(): void {
    combineLatest([this.issues$, this._filterQuery.all$])
      .pipe(untilDestroyed(this))
      .subscribe(([issues, filter]) => {
        this.issues = this.filterIssues(issues, filter);
      });
  }

  drop(event: CdkDragDrop<JIssue[]>) {
    const newIssue: JIssue = { ...event.item.data };
    const newIssues = [...event.container.data];
    if (event.previousContainer === event.container) {
      moveItemInArray(newIssues, event.previousIndex, event.currentIndex);
      this.updateListPosition(newIssues);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        newIssues,
        event.previousIndex,
        event.currentIndex
      );
      this.updateListPosition(newIssues);
      newIssue.status = event.container.id as IssueStatus;
      this._projectService.updateIssue(newIssue);
    }
  }

  filterIssues(issues: JIssue[], filter: FilterState): JIssue[] {
    const { onlyMyIssue, ignoreResolved, searchTerm, userIds } = filter;
    return issues.filter((issue) => {
      const isMatchTerm = searchTerm ? IssueUtil.searchString(issue.title, searchTerm) : true;

      const isIncludeUsers = userIds.length
        ? issue.userIds.some((userId) => userIds.includes(userId))
        : true;

      const isMyIssue = onlyMyIssue
        ? this.currentUserId && issue.userIds.includes(this.currentUserId)
        : true;

      const isIgnoreResolved = ignoreResolved ? issue.status !== IssueStatus.DONE : true;

      return isMatchTerm && isIncludeUsers && isMyIssue && isIgnoreResolved;
    });
  }

  private updateListPosition(newList: JIssue[]) {
    newList.forEach((issue, idx) => {
      const newIssueWithNewPosition = { ...issue, listPosition: idx + 1 };
      this._projectService.updateIssue(newIssueWithNewPosition);
    });
  }

}
