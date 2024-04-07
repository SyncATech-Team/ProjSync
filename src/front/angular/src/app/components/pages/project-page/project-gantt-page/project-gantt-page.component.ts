import { AfterViewInit, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
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
import { finalize, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { addDays, getUnixTime } from 'date-fns';

@Component({
  selector: 'app-project-gantt-page',
  templateUrl: './project-gantt-page.component.html',
  styleUrl: './project-gantt-page.component.css',
  providers: [GanttPrintService]
})
export class ProjectGanttPageComponent implements OnInit {

  projectName: string = '';

  /**
   * Opcije koje postoje za prikaz
   */
  views = [
    {
        name: 'Day',
        value: GanttViewType.day
    },
    {
        name: 'Week',
        value: GanttViewType.week
    },
    {
        name: 'Month',
        value: GanttViewType.month
    },
    {
        name: 'Quarter',
        value: GanttViewType.quarter
    },
    {
        name: 'Year',
        value: GanttViewType.year
    }
];
/**
 * Inicijalni prikaz pri otvaranju strane
 */
viewType: GanttViewType = GanttViewType.day;
/**
 * Prikaz koji je oznacen kao izabran u header-u
 */
selectedViewType: GanttViewType = GanttViewType.day;

isBaselineChecked = false;

isShowToolbarChecked = false;

loading = false;

items: GanttItem[] = [];

random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

randomItems(length: number, parent?: GanttItem, group?: string) {
  const items = [];
  for (let i = 0; i < length; i++) {
      const start = addDays(new Date(), this.random(-200, 200));
      const end = addDays(start, this.random(0, 100));
      items.push({
          id: `${parent?.id || group || ''}${Math.floor(Math.random() * 100000000)}`,
          title: `${parent?.title || 'Task'}-${i}`,
          start: getUnixTime(start),
          end: getUnixTime(end),
          group_id: group,
          expandable: true
      });
  }
  return items;
}

randomGroupsAndItems(length: number) {
  const groups: GanttGroup[] = [];
  let items: GanttItem[] = [];
  for (let i = 0; i < length; i++) {
      groups.push({
          id: `00000${i}`,
          title: `Group-${i}`
      });
      items = [...items, ... this.randomItems(6, undefined, groups[i].id)];
  }
  return {
      groups,
      items
  };
}

toolbarOptions: GanttToolbarOptions = {
    viewTypes: [GanttViewType.day, GanttViewType.month, GanttViewType.year]
};

baselineItems: GanttBaselineItem[] = [];

options = {
    viewType: GanttViewType.day
};

viewOptions = {
    dateFormat: {
        yearQuarter: `QQQ 'of' yyyy`,
        month: 'LLLL',
        yearMonth: `LLLL yyyy`,
        year: `'Year' yyyy`
    },
    linkOptions: {
        showArrow: true
    }
};

@HostBinding('class.gantt-example-component') class = true;

@ViewChild('gantt') ganttComponent?: NgxGanttComponent;

dropEnterPredicate = (event: GanttTableDragEnterPredicateContext) => {
    return true;
};

constructor(private printService: GanttPrintService) {}

ngOnInit(): void {
    // init items children

    this.items = this.randomItems(100);

    this.items.forEach((item, index) => {
        if (index % 5 === 0) {
            item.children = this.randomItems(this.random(1, 5), item);
        }
    });

    // console.log(this.items);
}

// ngAfterViewInit() {
//     setTimeout(() => this.ganttComponent.scrollToDate(1627729997), 200);
// }

barClick(event: GanttBarClickEvent) {
    // this.thyNotify.info('Event: barClick', `你点击了 [${event.item.title}]`);
}

lineClick(event: GanttLineClickEvent) {
    // this.thyNotify.info('Event: lineClick', `你点击了 ${event.source.title} 到 ${event.target.title} 的关联线`);
}

dragMoved(event: GanttDragEvent) {}

dragEnded(event: GanttDragEvent) {
    // this.thyNotify.info('Event: dragEnded', `修改了 [${event.item.title}] 的时间`);
    this.items = [...this.items];
}

selectedChange(event: GanttSelectedEvent) {
  if(this.ganttComponent && event.current?.start)
    event.current && this.ganttComponent.scrollToDate(event.current?.start);

    // this.thyNotify.info(
    //     'Event: selectedChange',
    //     `当前选中的 item 的 id 为 ${(event.selectedValue as GanttItem[]).map((item) => item.id).join('、')}`
    // );
}

linkDragEnded(event: GanttLinkDragEvent) {
    this.items = [...this.items];
    // this.thyNotify.info('Event: linkDragEnded', `创建了关联关系`);
}

print(name: string) {
    this.printService.print(name);
}

scrollToToday() {
    if(this.ganttComponent)
      this.ganttComponent.scrollToToday();
}

switchChange() {
    if (this.isBaselineChecked) {
        this.baselineItems = [
            { id: '000000', start: 1627728888, end: 1628421197 },
            { id: '000001', start: 1617361997, end: 1625483597 },
            { id: '000002', start: 1610536397, end: 1610622797 },
            { id: '000003', start: 1628507597, end: 1633345997 },
            { id: '000004', start: 1624705997 }
        ];
    } else {
        this.baselineItems = [];
    }
}

selectView(type: GanttViewType) {
    this.viewType = type;
    this.selectedViewType = type;
}

viewChange(event: GanttView) {
    console.log(event.viewType);
    this.selectedViewType = event.viewType;
}

refresh() {
    this.loading = true;
    of(this.randomItems(30))
        .pipe(
            delay(2000),
            finalize(() => {
                this.loading = false;
            })
        )
        .subscribe((res) => {
            this.items = res;
        });
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



}
