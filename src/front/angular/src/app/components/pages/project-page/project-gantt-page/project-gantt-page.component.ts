import { Component, HostBinding, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GanttBarClickEvent,
  GanttBaselineItem,
  GanttDragEvent,
  GanttItem,
  GanttLineClickEvent,
  GanttLinkDragEvent,
  GanttPrintService,
  GanttSelectedEvent,
  GanttTableDragDroppedEvent,
  GanttTableDragEndedEvent,
  GanttTableDragEnterPredicateContext,
  GanttTableDragStartedEvent,
  GanttToolbarOptions,
  GanttView,
  GanttViewType,
  NgxGanttComponent,
  GanttGroup
} from '@worktile/gantt';
import { addDays, fromUnixTime, getUnixTime } from 'date-fns';
import { IssueService } from '../../../../_service/issue.service';
import { MessagePopupService } from '../../../../_service/message-popup.service';

import { GANTT_GLOBAL_CONFIG } from '@worktile/gantt';
import { IssueDateUpdate } from '../../../../_models/issue-date-update.model';
import { IssueDependencyUpdater } from '../../../../_models/issue-dependency-create-delete';
import { ConfirmationService } from 'primeng/api';
import { GroupService } from '../../../../_service/group.service';

@Component({
  selector: 'app-project-gantt-page',
  templateUrl: './project-gantt-page.component.html',
  styleUrl: './project-gantt-page.component.css',
  providers: [
    GanttPrintService,
    {
        provide: GANTT_GLOBAL_CONFIG,
        useValue: {
            dateFormat: {
                week: `'Week ' w`,
                month: 'LLLL',
                quarter: `'Q'Q`,
                year: `'Year' yyyy`,
                yearMonth: `LLLL yyyy`,
                yearQuarter: `QQQ 'of' yyyy`
            },
            linkOptions: {
                showArrow: true,                // prikaz strelice na kraju linije
                lineType: 'straight'            // tip linije: | curve | straight |
            }
        }
    }
]
})
export class ProjectGanttPageComponent implements OnInit, AfterViewInit {

  projectName: string = '';
    viewOptions = { /*Opcije premestene u global config*/ };

/**
 * Opcije koje postoje za prikaz
*/
views = [
    { name: 'Day', value: GanttViewType.day },
    { name: 'Week', value: GanttViewType.week },
    { name: 'Month', value: GanttViewType.month },
    { name: 'Quarter', value: GanttViewType.quarter },
    { name: 'Year', value: GanttViewType.year }
];

/**
 * Inicijalni prikaz pri otvaranju strane
 */
viewType: GanttViewType = GanttViewType.year;
/**
 * Prikaz koji je oznacen kao izabran u header-u
 */
selectedViewType: GanttViewType = GanttViewType.year;
/**
 * Indikator da li je selektovano prikazivanje baseline-a
 */
isBaselineChecked = false;
/**
 * Indikator da li se prikazuje toolbar na gantt-u
 */
isShowToolbarChecked = false;

loading = false;

items: GanttItem[] = [];

groups: GanttGroup[] = [];

expanded = false;

/**
 * Koje opcije se prikazuju u toolbar-u
 */
toolbarOptions: GanttToolbarOptions = {
    viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
};

baselineItems: GanttBaselineItem[] = [];

options = {
    viewType: GanttViewType.day
};

@HostBinding('class.gantt-example-component') class = true;
@ViewChild('gantt') ganttComponent?: NgxGanttComponent;

dropEnterPredicate = (event: GanttTableDragEnterPredicateContext) => {
    return true;
};

constructor(
    private route: ActivatedRoute,
    private printService: GanttPrintService,
    private issueService: IssueService,
    private msgPopupService: MessagePopupService,
    private confirmationService: ConfirmationService,
    private groupService: GroupService
) {}

ngOnInit(): void {
    this.projectName = this.route.snapshot.paramMap.get('projectName')!;

    this.loading = true;

    this.groupService.getAllGroups(this.projectName).subscribe({
        next: response => {
            let data = response;
            const dataGroups = [];

            for(let group of data) {
                dataGroups.push({
                    id: "" + group.id,
                    title: group.name,
                    expanded: this.expanded
                })
            }
            this.groups = dataGroups;
            console.log(this.groups);
        },
        error: error => {
            console.log("ERROR!!!");
        } 
    })

    this.issueService.getAllIssuesForProject(this.projectName).subscribe({
        next: response => {
            let data = response;
            const dataIssues = [];
            
            for(let issue of data) {
                let startDate = new Date(issue.createdDate);
                let endDate = new Date(issue.dueDate);
                
                let dependentOnList: string[] = [];
                for(let issueId of issue.dependentOnIssues)
                    dependentOnList.push("" + issueId);
                
                dataIssues.push({
                    id: "" + issue.id,
                    title: issue.name,
                    start: getUnixTime(startDate),
                    end: getUnixTime(endDate),
                    group_id: "" + issue.groupId,
                    links: dependentOnList,
                    expandable: true,
                    draggable: true,
                    progress: issue.completed/100,
                    reporterUsername: issue.reporterUsername
                });
            }
            this.items = dataIssues;
            
            this.viewType = GanttViewType.day;
            this.selectedViewType = GanttViewType.day;
            this.loading = false;
            
        },
        error: error => {
            console.log("Error fetching tasks: " + error.error);
        }
    });
}

ngAfterViewInit(): void {
    // this.scrollToToday();
}

// ngAfterViewInit() {
    //     setTimeout(() => this.ganttComponent.scrollToDate(1627729997), 200);
    // }

barClick(event: GanttBarClickEvent) {
    // this.msgPopupService.showInfo(`Event: barClick [${event.item.title}]`);
}

lineClick(event: GanttLineClickEvent) {

    this.confirmationService.confirm({
        message: 'Do you want to delete this dependency?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",

        accept: () => {
            let source = event.source;
            let target = event.target;
            
            let model: IssueDependencyUpdater = {
                originId: source!.id as unknown as number,
                targetId: target!.id as unknown as number,
                isDelete: true
            }

            this.issueService.createOrDeleteIssueDependency(model).subscribe({
                next: response => {
                    this.msgPopupService.showInfo("Successfully deleted a dependency!");
                    this.refresh();
                },
                error: error => {
                    console.log("ERROR!!! " + error.error);
                }
            })
            
            this.items = [...this.items];
        },
        reject: () => {

        }
    })
    // this.msgPopupService.showInfo(`Event: lineClick ${event.source.title} to ${event.target.title} line`)
}

dragMoved(event: GanttDragEvent) {}

dragEnded(event: GanttDragEvent) {
    // this.msgPopupService.showInfo(`Event: dragEnded ${event.item.title}`);
    let issueId = event.item.id as unknown as number;
    let newStartDate = fromUnixTime(event.item.start!);
    let newEndDate = fromUnixTime(event.item.end!);
    
    let model: IssueDateUpdate = {
        id: issueId,
        startDate: newStartDate,
        endDate: newEndDate
    }
    
    this.issueService.updateIssueStartEndDate(issueId, model).subscribe({
        next: response => {
            this.msgPopupService.showInfo("Successfully changed timeline!");
        },
        error: error => {
            console.log("ERROR!!! " + error.error);
        }
    });
    
    this.items = [...this.items];
}

selectedChange(event: GanttSelectedEvent) {
  if(this.ganttComponent && event.current?.start) {
    event.current && this.ganttComponent.scrollToDate(event.current?.start);
  }
}

linkDragEnded(event: GanttLinkDragEvent) {

    let source = event.source;
    let target = event.target;
    let type = event.type;

    let model: IssueDependencyUpdater = {
        originId: source!.id as unknown as number,
        targetId: target!.id as unknown as number,
        isDelete: false
    }

    this.issueService.createOrDeleteIssueDependency(model).subscribe({
        next: response => {
            this.msgPopupService.showInfo("Successfully created a dependency!");
        },
        error: error => {
            console.log("ERROR!!! " + error.error);
        }
    })

    this.items = [...this.items];
    // this.thyNotify.info('Event: linkDragEnded', `创建了关联关系`);
}

print(name: string) {
    this.printService.print(name);
}

scrollToToday() {
    if(this.ganttComponent)
      this.ganttComponent.scrollToDate(getUnixTime(new Date()));
}

selectView(type: GanttViewType) {
    this.viewType = type;
    this.selectedViewType = type;
}

viewChange(event: GanttView) {
    this.selectedViewType = event.viewType;
}

refresh() {
    this.ngOnInit();
}

onDragDropped(event: GanttTableDragDroppedEvent) {
    const sourceItems = event.sourceParent?.children || this.items;
    sourceItems.splice(sourceItems.indexOf(event.source), 1);
    if (event.dropPosition === 'inside') {
        event.target.children = [...(event.target.children || []), event.source];
    } else {
        const targetItems = event.targetParent?.children || this.items;
        if (event.dropPosition === 'before') {
            targetItems.splice(targetItems.indexOf(event.target), 0, event.source);
        } else {
            targetItems.splice(targetItems.indexOf(event.target) + 1, 0, event.source);
        }
    }
    this.items = [...this.items];
}

onDragStarted(event: GanttTableDragStartedEvent) {
    console.log('Drag started', event);
}

onDragEnded(event: GanttTableDragEndedEvent) {
    console.log('Drag ended', event);
}

expandAllGroups() {
    if (this.expanded) {
        this.expanded = false;
        this.ganttComponent!.collapseAll();
    } else {
        this.expanded = true;
        this.ganttComponent!.expandAll();
    }
}

}
