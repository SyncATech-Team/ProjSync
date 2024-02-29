import { Component, OnInit } from '@angular/core';
import { TodoTask } from 'src/app/models/todoTask.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit{

  constructor(private todoServie: TodoService ){}
  
  tasks: TodoTask[] = [];
  newTask: TodoTask ={
    id: 0,
    description: '',
    createdDate: new Date(),
    dueDate: new Date()
  }
  taskToUpdate: TodoTask ={
    id: 0,
    description: '',
    createdDate: new Date(),
    dueDate: new Date()
  }
  
  ngOnInit(): void {
    this.getAllTasks();
    
  }

  getAllTasks(): void{
    this.todoServie.getAllTasks().subscribe({
      next: (res)=>{
        this.tasks= res;
      }
    });
  }
  
  addTask(): void{
    this.newTask.createdDate = new Date();
    this.todoServie.addTask(this.newTask).subscribe({
      next: (res)=>
      {
        this.getAllTasks();
      }
    });
  }

  deleteTask(id: number): void 
  {
    console.log(id);
    this.todoServie.deleteTask(id).subscribe({
      next: (res)=>{
        this.getAllTasks();
      }
    })
  }

  updateTask2(task: TodoTask):void 
  {
    this.taskToUpdate = task;
  }

  updateTask():void{
    this.todoServie.updateTask(this.taskToUpdate).subscribe({
      next: (res)=>
      {
        this.getAllTasks();
      }
    })
  }
  
}
