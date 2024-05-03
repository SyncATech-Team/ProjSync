import { Component, Input, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { LogsService } from '../../../_service/logs.service';
import { Log } from '../../../_models/log.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  lazyLoading: boolean = false;
  loadLazyTimeout: any;

  @Input() projectName: string = "";

  constructor(
    private logService: LogsService,
    private _sanitizer: DomSanitizer
  ) { }


  ngOnInit(): void {
    this.logService.getLogsCount(this.projectName).subscribe({
      next: response => {
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


    this.logService.getLogsRange(this.projectName, first, last).subscribe({
      next: response => {
        this.lazyLoading = false;
        const lazyItems = [...this.logs];

        for(let i = 0; i < response.length; i++) {
          lazyItems[first+i] = response[i];
        }
        
        this.logs = lazyItems;
      },
      error: error => {
        console.log(error.error);
      }
    })
  }

  getSanitizedHTML(content: string): string | null {
    let result = this._sanitizer.sanitize(SecurityContext.HTML,this._sanitizer.bypassSecurityTrustHtml(content));
    return result;
  }

}
