import { Component, Output, EventEmitter, HostListener, Input, OnInit, Injectable } from '@angular/core';
import { navbarData } from './nav-data';
import { AccountService } from '../../../_service/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyroleService } from '../../../_service/companyrole.service';
import { ProjectService } from '../../../_service/project.service';
import { Project } from '../../../_models/project.model';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

interface SideNavToggle{
  screenWidth : number;
  collapsed: boolean;
}

@Component({
  selector: 'app-project-sidebar',
  templateUrl: './project-sidebar.component.html',
  styleUrl: './project-sidebar.component.css'
})
@Injectable({
  providedIn: 'root'
})
export class ProjectSidebarComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  ref: DynamicDialogRef | undefined;

  //TRUE -> otvoren side nav
  //FALSE -> zatvoren side nav
  collapsed : boolean = false;
  screenWidth = 0;
  navData = navbarData;
  @Input() projectName: string | null = '';
  projectType: string = "";
  projectKey: string = "";

  project: Project | null = null;

  MAX_PROJECT_NAME: number = 12;
  permitions: any;

  projectImageSource : string = "";
  defaultImagePath : string = "../../../../../assets/project-icon/default_project_image.png";

  constructor(
    public accoutService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private companyroleService: CompanyroleService,
    private projectService: ProjectService,
    public dialogService: DialogService,
    public messageService: MessageService
    ) { 
    this.screenWidth = window.innerWidth;
    this.setCollapsedState();
    this.projectName = route.snapshot.paramMap.get('projectName');
    var user = this.accoutService.getCurrentUser();
    if(user?.permitions)
      this.permitions = user.permitions;
    if(this.permitions.canManageProjects === 'False')
      this.navData = this.navData.filter((item)=> item.label != 'Project settings');
        
    if(this.permitions.canManageTasks === 'False')
      this.navData = this.navData.filter((item)=> item.label != 'Create task');

  }
  
  ngOnInit(): void {
    this.projectService.getProjectByName(this.projectName).subscribe({
      next: (response) => {
        this.project = response;
        this.projectType = this.project.typeName;
        this.projectKey = this.project.key;
        this.projectImageSource = this.project.icon!;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;
    this.setCollapsedState();
  }

  setCollapsedState() {
    if (this.screenWidth > 960) {
      this.collapsed = true;
    } else {
      this.collapsed = false;
    }
    this.emitToggleEvent();
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav() {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  emitToggleEvent() {
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }
  
  getProjectName(): string {
    if(!this.projectName) return "Project Name";
    
    let s: string;
    if(this.projectName.length > this.MAX_PROJECT_NAME)
      s = this.projectName.substring(0, this.MAX_PROJECT_NAME) + "...";
    else
      s = this.projectName;

    return s;
  }

  handleNavigation(label: string) {
    if (label === 'Create task') {
        this.showCreateTaskPopup();
    }
  }

  showCreateTaskPopup() {
      this.ref = this.dialogService.open(CreateTaskComponent, {
        header: 'Create task',
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
        let summary_and_detail;
        if (data) {
            const buttonType = data?.buttonType;
            summary_and_detail = buttonType ? { summary: 'No Product Selected', detail: `Pressed '${buttonType}' button` } : { summary: 'Product Selected', detail: data?.name };
        }
      });
  }

  setProjectPicture(src : string){
    let element = document.getElementById("projectImage");
    let image = element as HTMLImageElement;

    if(src === "SLIKA_JE_NULL") {
      image.src = this.defaultImagePath;
    }
    else {
      image.src = src;
    }
  }

  shouldShowProjectSettings() {
    return this.permitions.canManageProjects === 'True' || this.project?.ownerUsername == this.accoutService.getCurrentUser()?.username;
  }

}