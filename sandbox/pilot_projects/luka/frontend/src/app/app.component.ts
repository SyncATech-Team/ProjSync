import { Component } from '@angular/core';
import { ItemService } from './services/item.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  items:any[]=[];
  name:any;

  constructor (private service:ItemService){

  }

  addItem(){
    this.service.addItem(this.name).subscribe(data=>{this.service.getItems().subscribe(data => this.items=data);});
  }

  delItem(Id:any){
    this.service.delItem(Id).subscribe(data=>{this.service.getItems().subscribe(data => this.items=data);});
  }

  ngOnInit(){

    this.service.getItems().subscribe(data => this.items=data);
  }

  title = 'front';
}
