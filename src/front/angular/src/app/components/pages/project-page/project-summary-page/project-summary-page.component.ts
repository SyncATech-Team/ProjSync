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

  @ViewChild('issueTypes') private issueTypesRef!: ElementRef;
  private issueTypesChart: any;

  constructor (
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private sanitizer: DomSanitizer,
    private statisticsService: StatisticsService
  ){
    this.projectName = route.snapshot.paramMap.get('projectName');
  }

  ngAfterViewInit(): void {

    this.statisticsService.getIssueTypesInProject(this.projectName!).subscribe({
      next: response => {
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
                '#8fb1e7',
                'rgb(230, 59, 59)',
                'rgb(125, 225, 125)'
              ]
            }]
          }
        });

      },
      error: error => {
        console.log(error.error);
      }
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
}
