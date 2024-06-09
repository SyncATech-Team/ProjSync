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
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateTaskComponent } from '../../../elements/create-task/create-task.component';
import { IssueModalComponent } from '../../../elements/issues/issue-modal/issue-modal.component';
import { ProjectQuery } from '../../../state/project/project.query';
import { PhotoForUser } from '../../../../_models/photo-for-user';
import { UserOnProjectService } from '../../../../_service/userOnProject.service';
import { UserGetter } from '../../../../_models/user-getter';
import { UserProfilePicture } from '../../../../_service/userProfilePicture.service';
import { ProjectService } from '../../../state/project/project.service';
import { DateService } from '../../../../_service/date.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../../../../_service/account.service';

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

ref: DynamicDialogRef | undefined;

ref1: DynamicDialogRef | undefined;
users: UserGetter[] = [];
usersPhotos!: PhotoForUser[];

canManageTask: string = '';

/**
 * Koje opcije se prikazuju u toolbar-u
 */
toolbarOptions: GanttToolbarOptions = {
    viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
};

baselineItems: GanttBaselineItem[] = [];

showConfirmDialog = true;

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
    private accountService: AccountService, 
    private _modalService: DialogService,
    private _projectQuery: ProjectQuery,
    private userOnProject : UserOnProjectService,
    public userPictureService: UserProfilePicture,
    private _projectService: ProjectService,
    private translateService: TranslateService
) {

    this.translateService.get([
        'project-gantt-page.day',
        'project-gantt-page.week',
        'project-gantt-page.month',
        'project-gantt-page.quarter',
        'project-gantt-page.year'
    ]).subscribe({
        next: (res: any) => { // Explicitly define the type of 'res' as 'any'
            this.views = [
                { name: res['project-gantt-page.day'], value: GanttViewType.day },
                { name: res['project-gantt-page.week'], value: GanttViewType.week },
                { name: res['project-gantt-page.month'], value: GanttViewType.month },
                { name: res['project-gantt-page.quarter'], value: GanttViewType.quarter },
                { name: res['project-gantt-page.year'], value: GanttViewType.year }
            ];

            
        }
    
    })

    this.projectName = this.route.snapshot.paramMap.get('projectName')!;
    this._projectService.getProject(this.projectName);
}

ngOnInit(): void {
    this.loading = true;

    this.fetchGroups();
    this.fetchIssues();
    this.fetchUsers();

    var user = this.accountService.getCurrentUser();
    
    if(user?.permitions) {

      this.canManageTask = user.permitions.canManageTasks;
    }
}

fetchGroups() {
    // groups$ Observable postoji, dobijen u konstruktoru i nalazi se u state-u
    this._projectQuery.groups$.subscribe({
        next: response => {
            let data = response;
            const dataGroups = [];

            for(let group of data) {
                dataGroups.push({
                    // dodavanje nula za id da bi se razlikovali id-evi za task i grupe
                    id: "0000" + group.id,
                    title: group.name,
                    expanded: this.expanded
                })
            }
            this.groups = dataGroups;
        }
    });
}

fetchIssues() {
    // issues$ Observable postoji, dobijen u konstruktoru i nalazi se u state-u
    this._projectQuery.issues$.subscribe({
        next: response => {
            let data = response;
            const dataIssues = [];
            
            for(let issue of data) {
                let startDate = new Date(issue.createdAt);
                let endDate = new Date(issue.dueDate);
                
                let dependentOnList: string[] = [];
                for(let issueId of issue.dependentOnIssues)
                    dependentOnList.push("" + issueId);
                
                dataIssues.push({
                    id: issue.id.toString(),
                    title: issue.title,
                    start: getUnixTime(startDate),
                    end: getUnixTime(endDate),
                    group_id: "0000" + issue.groupId,
                    links: dependentOnList,
                    expandable: true,
                    draggable: true,
                    progress: issue.completed/100,
                    reporterUsername: issue.reporterUsername,
                    color: issue.completed === 100 ? 'lightgreen' : ''
                });
            }
            this.items = dataIssues;
            this.viewType = GanttViewType.day;
            this.selectedViewType = GanttViewType.day;
            this.loading = false;
        }
    });
}

fetchUsers() {
    this.userOnProject.getAllUsersOnProject(this.projectName).subscribe({
        next: (response) => {
            this.users = response.filter(user => user.username !== 'admin');
            this.usersPhotos = this.userPictureService.getUserProfilePhotos(this.users);
        },
        error: (error) => {
            console.log(error);
        }
    });
}

// ngAfterViewInit(): void {
    // this.scrollToToday();
// }

ngAfterViewInit() {
    setTimeout(() => this.ganttComponent!.scrollToToday(), 200);
}

barClick(event: GanttBarClickEvent) {
    // this.msgPopupService.showInfo(`Event: barClick [${event.item.title}]`);

    this.openIssueModal(event.item.id);

}

openIssueModal(issueId : string){
    this.showConfirmDialog = false; // ne prikazuj dialog za potvrdu gantt stranice kada se otvori modal za issue
    this.translateService.get('issue.issue-details').subscribe((res: string) => {
        this.ref1 = this._modalService.open(IssueModalComponent, {
            header: res,
            width: '65%',
            modal:true,
            closable: true,
            maximizable: true,
            dismissableMask: true,
            closeOnEscape: true,
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                issue$: this._projectQuery.issueById$(issueId.toString()),
                usersPhotos: this.usersPhotos
            }
        });

        this.ref1.onClose.subscribe({
            next: _ => {
                this.showConfirmDialog = true;
                this.refresh();
            }
        });
    });
  }

lineClick(event: GanttLineClickEvent) {
    if(this.hasPermissionToManageTasks() === false) return;
    
    this.translateService.get([
        'project-gantt-page.do-you-want-to-delete-this-dependency',
        'project-gantt-page.delete-confirmation',
        'project-gantt-page.dependency-deleted',
        'general.delete'
    ]).subscribe((res: any) => {
        this.confirmationService.confirm({
            message: res['project-gantt-page.do-you-want-to-delete-this-dependency'],
            header: res['project-gantt-page.delete-confirmation'],
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
                        this.msgPopupService.showInfo(res['project-gantt-page.dependency-deleted']);
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
    });
    // this.msgPopupService.showInfo(`Event: lineClick ${event.source.title} to ${event.target.title} line`)
}

dragMoved(event: GanttDragEvent) {}

dragEnded(event: GanttDragEvent) {
    // this.msgPopupService.showInfo(`Event: dragEnded ${event.item.title}`);
    let issueId = event.item.id as unknown as number;
    let newStartDate = DateService.convertToUTC(fromUnixTime(event.item.start!));
    let newEndDate = DateService.convertToUTC(fromUnixTime(event.item.end!));
    
    let model: IssueDateUpdate = {
        id: issueId,
        startDate: newStartDate,
        endDate: newEndDate
    }
    
    this.issueService.updateIssueStartEndDate(issueId, model).subscribe({
        next: response => {
            this.translateService.get('project-gantt-page.task-dates-changed').subscribe((res: string) => {
                this.msgPopupService.showInfo(res);
            });
        },
        error: error => {
            console.log("ERROR!!! " + error.error);
            this.translateService.get('project-gantt-page.cannot-start-before-project-start-date').subscribe((res: string) => {
                this.msgPopupService.showError(res);
            });
            this.refresh();
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
        next: _ => {
            this.translateService.get('project-gantt-page.dependency-created').subscribe((res: string) => {
                this.msgPopupService.showInfo(res);
            });
            this.refresh();
        },
        error: _ => {
            
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
    this.expanded = true;
    this.ganttComponent!.expandAll();
}

refresh() {
    this.loading = true;
    this.fetchGroups();
    this.fetchIssues();
    this.fetchUsers();
    this._projectService.getProject(this.projectName);
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

}

onDragEnded(event: GanttTableDragEndedEvent) {

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

showCreateTaskPopupTaskGantt() {
    this.translateService.get('project-gantt-page.create-task').subscribe((res: string) => {
    
        this.ref = this._modalService.open(CreateTaskComponent, {
            header: res,
              width: '50%',
              contentStyle: { overflow: 'auto' },
              baseZIndex: 10000,
              maximizable: true,
              closable: true,
              modal: true,
              dismissableMask: true,
              closeOnEscape: true,
              data: {
                projectName: this.projectName
              }
          });
      
          this.ref.onClose.subscribe((data: any) => {
            if(data !== "created-task") return;         // NE REFRESHUJ STRANICU AKO NIJE DODAT ZADATAK
      

            this.refresh();
          });

    });

  }

  hasPermissionToManageTasks() {
    return this.canManageTask === 'True';
  }

}
