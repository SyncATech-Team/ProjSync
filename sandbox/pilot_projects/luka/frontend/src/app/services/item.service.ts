import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http:HttpClient) {}

  addItem(name:string ){
    return this.http.post("http://localhost:5243/api/ToDoApp",{"name":name ,"done":false});
  }

  delItem(Id:any){
    return this.http.delete("http://localhost:5243/api/ToDoApp/"+Id);
  }

  getItems(){
    return this.http.get<any>("http://localhost:5243/api/ToDoApp");
  }

}
