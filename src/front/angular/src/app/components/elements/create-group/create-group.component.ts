import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GroupService } from '../../../_service/group.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css'
})
export class CreateGroupComponent implements OnInit {
  projectName: string | null = '';
  form : FormGroup;

  groupName : string = '';

  constructor(
    private _modal : DynamicDialogRef,
    private formBuilder : FormBuilder,
    private _dialogConfig : DynamicDialogConfig,
    private groupService : GroupService
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
      this.groupName = this.form.controls['group-name'].value;
      console.log(this.groupName);

      this.groupService.createGroup(this.projectName, this.groupName).subscribe({
        next : (response) => {
          console.log(response);
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
