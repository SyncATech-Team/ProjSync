import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../../../_models/project.model';
import { ProjectService } from '../../../../_service/project.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Chart } from 'chart.js/auto';
import { StatisticsService } from '../../../../_service/statistics.service';

@Component({
  selector: 'app-project-summary-page',
  templateUrl: './project-summary-page.component.html',
  styleUrl: './project-summary-page.component.css'
})
export class ProjectSummaryPageComponent implements OnInit, AfterViewInit {
  projectName: string | null = '';
  projectType: string = '';
  projectKey: string = '';
  isLoading: boolean = true;
  projectImageSource : string = "";
  defaultImagePath : string = "../../../../../assets/project-icon/default_project_image.png";

  project: Project = {
    name: "",
    key: "",
    typeName: "",
    description: "",
    ownerUsername: "",
    creationDate: new Date(), 
    dueDate: new Date(),
    budget: 0,
    visibilityName: ""
  }

  TypesOfTasksPerProject!: { [key: string]: string };

  safeDescription: SafeHtml | undefined;

  // CHARTS
  @ViewChild('issueTypes') private issueTypesRef!: ElementRef;
  private issueTypesChart: any;

  @ViewChild('issuePriorities') private issuePrioritiesRef!: ElementRef;
  private issuePrioritiesChart: any;

  @ViewChild('issueStatuses') private issueStatusesRef!: ElementRef;
  private issueStatusesChart: any;

  @ViewChild('issueGroups') private issueGroupsRef!: ElementRef;
  private issueGroupsChart: any;

  ////////////////////

  constructor (
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private sanitizer: DomSanitizer,
    private statisticsService: StatisticsService
  ){
    this.projectName = route.snapshot.paramMap.get('projectName');
  }

  ngAfterViewInit(): void {

    // Kreiranje grafika o tipu zadataka
    this.statisticsService.getIssueTypesInProject(this.projectName!).subscribe({
      next: response => { this.createChartTaskType(response); },
      error: error => { console.log(error.error); }
    })

    // Kreiranje grafika o prioritetu zadataka
    this.statisticsService.getIssuePrioritiesInProject(this.projectName!).subscribe({
      next: response => { this.createChartTaskPriority(response); },
      error: error => { console.log(error.error); }
    })

    // Krairanje grafika o statusu zadataka
    this.statisticsService.getIssueStatusesInProject(this.projectName!).subscribe({
      next: response => { this.createChartTaskStatus(response); },
      error: error => { console.log(error.error); }
    })

    // Kreiranje grafika o groupama zadataka na projektu
    this.statisticsService.getIssueGroupsInProject(this.projectName!).subscribe({
      next: response => { this.createChartTaskGroups(response); },
      error: error => { console.log(error.error); }
    })

  }

  ngOnInit(): void {
    this.projectService.getProjectByName(this.projectName).subscribe({
      next: (response)=>{
        this.project= response;
        this.projectType = this.project.typeName;
        this.projectKey = this.project.key;
        this.projectImageSource = this.project.icon!;
        this.isLoading = false;
        this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(this.project.description);
      },
      error: (error)=>{
        console.log(error);
      }
    });

  }

  getDefaultImagePath(): string {
    // let x: number = this.getRandomInteger(1, 10);
    let x: number = 1;
    let path: string = "../../../../../assets/images/DefaultAccountProfileImages/default_account_image_" + x + ".png";
    
    // console.log(path);

    return path;
  }

  public createChartTaskType(response: {[key: string]: string}) {
    let labels: string[] = [];
    let data: number[] = [];
    
    for(let element in response) {
      labels.push(element);
      data.push(Number(response[element]));
    }

    this.issueTypesChart = new Chart(this.issueTypesRef.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#3B82F6',
            '#ef4444',
            '#22c55e'
          ],
          borderColor: "white"
        }]
      }
    });
  }

  public createChartTaskPriority(response: {[key: string]: string}) {
    let labels: string[] = [];
    let data: number[] = [];
    
    for(let element in response) {
      labels.push(element);
      data.push(Number(response[element]));
    }

    this.issuePrioritiesChart = new Chart(this.issuePrioritiesRef.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            "#22c55e",
            "#3B82F6",
            "#0ea5e9",
            "#f97316",
            "#ef4444"
          ],
          borderColor: "white"
        }]
      }
    });
  }

  public createChartTaskStatus(response: {[key: string]: string}) {
    let labels: string[] = [];
    let data: number[] = [];
    
    for(let element in response) {
      labels.push(element);
      data.push(Number(response[element]));
    }

    this.issueStatusesChart = new Chart(this.issueStatusesRef.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data
        }]
      }
    });
  }

  public createChartTaskGroups(response: {[key: string]: string}) {
    let labels: string[] = [];
    let data: number[] = [];
    
    for(let element in response) {
      labels.push(element);
      data.push(Number(response[element]));
    }

    this.issueGroupsChart = new Chart(this.issueGroupsRef.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data
        }]
      }
    });
  }

  // Function to download the chart
  downloadChart(canvasId: string) {
    var canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if(canvas) {
      var image = canvas.toDataURL('image/png'); // Convert canvas to image
      var link = document.createElement('a');
      link.download = 'chart.png';
      link.href = image;
      link.click();
    }
  }

}
