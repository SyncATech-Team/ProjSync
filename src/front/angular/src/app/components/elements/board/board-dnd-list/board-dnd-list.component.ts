import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IssueStatus, IssueStatusDisplay, JIssue } from '../../../../_models/issue';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, map } from 'rxjs';

@Component({
  selector: '[board-dnd-list]',
  templateUrl: './board-dnd-list.component.html',
  styleUrl: './board-dnd-list.component.css',
  encapsulation: ViewEncapsulation.None
})
@UntilDestroy()
export class BoardDndListComponent implements OnInit {
  IssueStatusDisplay = IssueStatusDisplay;
  @Input() status!: IssueStatus;
  @Input() issues$!: Observable<JIssue[]>;
  issues!: JIssue[];

  constructor() { }

  ngOnInit(): void {
    this.issues$.pipe(untilDestroyed(this)).subscribe(
      (issues: JIssue[]) => this.issues = issues
    );
  }

  drop(event: CdkDragDrop<JIssue[]>) {
    let isMovingInsideTheSameList = event.previousContainer === event.container;
    if (isMovingInsideTheSameList) {

      moveItemInArray(
        event.container.data, 
        event.previousIndex, 
        event.currentIndex);
    
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
      )
    }
  }

}