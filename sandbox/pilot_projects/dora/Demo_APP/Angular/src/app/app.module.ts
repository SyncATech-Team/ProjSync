import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CitizensListComponent } from './components/citizens/citizens-list/citizens-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AddCitizenComponent } from './components/citizens/add-citizen/add-citizen.component';
import { FormsModule } from '@angular/forms';
import { EditCitizenComponent } from './components/citizens/edit-citizen/edit-citizen.component';

@NgModule({
  declarations: [
    AppComponent,
    CitizensListComponent,
    AddCitizenComponent,
    EditCitizenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
