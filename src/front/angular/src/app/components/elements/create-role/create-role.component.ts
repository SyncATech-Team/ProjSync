import { Component, ViewChild } from '@angular/core';
import { CompanyRole } from '../../../_models/company-role';
import { CompanyroleService } from '../../../_service/companyrole.service';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { NgForm } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent {
  
  roleToCreate: CompanyRole = {
    name: '',
    canUploadFiles: false,
    canLeaveComments: false,
    canUpdateTaskProgress: false,
    canManageProjects: false,
    canManageTasks: false
  }

  @ViewChild('createRoleForm') formRecipe?: NgForm;

  constructor(
    private croleService: CompanyroleService,
    private msgPopUpService: MessagePopupService,
    private changeDetectorRef: ChangeDetectorRef) { }

  createRole() {
    console.log(this.roleToCreate);
    this.croleService.create(this.roleToCreate).subscribe({
      next: (response) => {
        this.msgPopUpService.showSuccess("Successfully created new role!");
        this.onSuccessfullCreation();
      },
      error: (error) => {
        this.msgPopUpService.showError("Unable to create new role! Make sure there are no duplicate names.")
      }
    })
  }

  onSuccessfullCreation() {
    this.formRecipe?.reset();
    this.changeDetectorRef.detectChanges();

    this.roleToCreate.name = '';
    this.roleToCreate.canLeaveComments = false;
    this.roleToCreate.canManageProjects = false;
    this.roleToCreate.canManageTasks = false;
    this.roleToCreate.canUpdateTaskProgress = false;
    this.roleToCreate.canUploadFiles = false;
  }

}
