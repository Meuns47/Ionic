import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private nextId = 1;
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor() {}

  /**
   * Récupère la liste des tâches
   */
  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  /**
   * Ajoute une nouvelle tâche
   */
  addTask(task: Omit<Task, 'id'>): void {
    const newTask: Task = {
      id: this.nextId++,
      ...task
    };
    this.tasks.unshift(newTask);
    this.tasksSubject.next([...this.tasks]);
  }

  /**
   * Met à jour une tâche
   */
  updateTask(taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): void {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        ...updatedTask,
        id: taskId
      };
      this.tasksSubject.next([...this.tasks]);
    }
  }

  /**
   * Supprime une tâche
   */
  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.tasksSubject.next([...this.tasks]);
  }
}
