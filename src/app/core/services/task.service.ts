import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

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
  addTask(task: Omit<Task, 'id' | 'completed'>): void {
    const newTask: Task = {
      id: this.nextId++,
      completed: false,
      ...task
    };
    this.tasks.unshift(newTask);
    this.tasksSubject.next([...this.tasks]);
  }

  /**
   * Supprime une tâche
   */
  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.tasksSubject.next([...this.tasks]);
  }

  /**
   * Met à jour l'état de complétion d'une tâche
   */
  updateTaskCompletion(taskId: number, completed: boolean): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = completed;
      this.tasksSubject.next([...this.tasks]);
    }
  }
}
