import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitizensListComponent } from './components/citizens/citizens-list/citizens-list.component';
import { AddCitizenComponent } from './components/citizens/add-citizen/add-citizen.component';
import { EditCitizenComponent } from './components/citizens/edit-citizen/edit-citizen.component';

const routes: Routes = [
  {
    path: '',
    component: CitizensListComponent
  },
  {
    path: 'citizens',
    component: CitizensListComponent
  },
  {
    path: 'citizens/add',
    component: AddCitizenComponent
  },
  {
    path: 'citizens/edit/:umcn',
    component: EditCitizenComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
