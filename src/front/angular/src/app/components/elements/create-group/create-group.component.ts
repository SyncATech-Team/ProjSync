import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GroupService } from '../../../_service/group.service';
import { GroupInProject } from '../../../_models/group-in-project';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { MessagePopupService } from '../../../_service/message-popup.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css'
})
export class CreateGroupComponent implements OnInit {
  projectName: string | null = '';
  form : FormGroup;

  groupName : string = '';

  groupInProject : GroupInProject = {
    projectName : "",
    groupName : ""
  }

  constructor(
    private _modal : DynamicDialogRef,
    private formBuilder : FormBuilder,
    private _dialogConfig : DynamicDialogConfig,
    private groupService : GroupService,
    private msgPopUpService: MessagePopupService
  ){
    this.form = this.formBuilder.group({
      'group-name' : []
    });
    console.log(this.form.controls['group-name'])
  }

  ngOnInit(){
    this.projectName = this._dialogConfig.data.projectName;
  }

  onSubmit(){
    if(this.projectName){
      // console.log(this.form.controls['group-name'].value);
      // console.log(this.projectName);
      this.groupInProject.groupName = this.form.controls['group-name'].value;
      this.groupInProject.projectName = this.projectName;
      console.log(this.groupInProject);
      
      this.groupService.createGroup(this.groupInProject).subscribe({
        next : (response) => {
          this.msgPopUpService.showSuccess("Group successfully created");
          this._modal.close();          
        },
        error : (error) => {
          console.log(error);
        }
      });
    }
  }

  closeModal() {
    this._modal.close();
  }
}
