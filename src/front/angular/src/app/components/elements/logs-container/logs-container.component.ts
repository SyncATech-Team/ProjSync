import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LogsService } from '../../../_service/logs.service';
import { Log } from '../../../_models/log.model';

interface LazyEvent {
  first: number;
  last: number;
}

@Component({
  selector: 'app-logs-container',
  templateUrl: './logs-container.component.html',
  styleUrl: './logs-container.component.css'
})
export class LogsContainerComponent implements OnInit {

  logs: Log[] = [];
  lazyLoading: boolean = true;
  loadLazyTimeout: any;

  @Input() projectName: string = "";

  constructor(
    private logService: LogsService
  ) { }


  ngOnInit(): void {
    this.logService.getLogsCount(this.projectName).subscribe({
      next: response => {
        console.log("Total log count: " + response);
        this.logs = Array.from( {length: response} )
      },
      error: error => {
        console.log(error.error);
      }
    })
  }

  onLazyLoad(event: LazyEvent) {
    this.lazyLoading = true;
    let first = event.first;
    let last = event.last;

    this.logService.getLogsRange(this.projectName, event.first, event.last).subscribe({
      next: response => {
        const lazyItems = [...this.logs];

        for (let i = first; i < last; i++) {
          lazyItems[i] = response[i];
        }
        this.logs = lazyItems;
        this.lazyLoading = false;
      },
      error: error => {
        console.log(error.error);
      }
    })
  }

}
