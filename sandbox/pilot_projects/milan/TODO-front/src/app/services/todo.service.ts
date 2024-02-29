import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoTask } from '../models/todoTask.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  backUrl: string = "https://localhost:7190";
  constructor(private http: HttpClient ) { }

  getAllTasks(): Observable<TodoTask[]>{
    return this.http.get<TodoTask[]>(this.backUrl + '/api/todo');
  }

  addTask(newTask: TodoTask): Observable<TodoTask>{
    return this.http.post<TodoTask>(this.backUrl+'/api/todo', newTask);
  }

  deleteTask(id:number): Observable<TodoTask>{
    return this.http.delete<TodoTask>(this.backUrl+`/api/todo/${id}`);
  }

  updateTask(task:TodoTask): Observable<TodoTask>{
    return this.http.put<TodoTask>(this.backUrl+`/api/todo/${task.id}`,task);
  }
}
