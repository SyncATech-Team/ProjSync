import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GroupService } from '../../../_service/group.service';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { GroupInProjectSend } from '../../../_models/group-in-project-send';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css'
})
export class CreateGroupComponent implements OnInit {
  projectName: string | null = '';
  form : FormGroup;

  groupName : string = '';

  groupInProject : GroupInProjectSend = {
    ProjectName : "",
    GroupName : ""
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
    // console.log(this.form.controls['group-name'])
  }

  ngOnInit(){
    this.projectName = this._dialogConfig.data.projectName;
  }

  onSubmit(){
    if(this.projectName){
      // console.log(this.form.controls['group-name'].value);
      // console.log(this.projectName);
      // console.log(this.form.controls['group-name'].value);
      if(this.form.controls['group-name'].value == null){
        this.msgPopUpService.showError("Unable to create group. Group name can not be empty.");
        return;
      }
      this.groupInProject.GroupName = this.form.controls['group-name'].value;
      this.groupInProject.ProjectName = this.projectName;
      // console.log(this.groupInProject);
      
      this.groupService.createGroup(this.groupInProject).subscribe({
        next : (response) => {
          this.msgPopUpService.showSuccess("Group successfully created");
          this.closeModal("created-group");        
        },
        error : (error) => {
          this.msgPopUpService.showError(error.error.message);
          // this.msgPopUpService.showError("Unable to create group. Duplicate name inside project!");
        }
      });
    }
  }

  closeModal(param: string) {
    this._modal.close(param);
  }
}
