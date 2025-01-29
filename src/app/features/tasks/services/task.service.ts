import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { StorageService } from '../../../core/storage/storage.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly TASKS_KEY = 'tasks';
  private tasks: Task[] = [];
  private tasksUpdate = new Subject<void>();

  constructor(private storageService: StorageService) {
    this.loadTasks();
  }

  private async loadTasks(): Promise<void> {
    const tasks = await this.storageService.get(this.TASKS_KEY) as Task[];
    this.tasks = tasks || [];
  }

  async getTasks(): Promise<Task[]> {
    await this.loadTasks();
    return this.tasks;
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    await this.loadTasks();
    return this.tasks.find(task => task.id === id);
  }

  async addTask(task: Task): Promise<void> {
    await this.loadTasks();
    task.id = Date.now();
    task.createdAt = new Date();
    this.tasks.push(task);
    await this.storageService.set(this.TASKS_KEY, this.tasks);
    this.tasksUpdate.next();
  }

  async updateTask(id: number, updatedTask: Task): Promise<void> {
    await this.loadTasks();
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...updatedTask, id };
      await this.storageService.set(this.TASKS_KEY, this.tasks);
      this.tasksUpdate.next();
    }
  }

  async deleteTask(id: number): Promise<boolean> {
    await this.loadTasks();
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    if (this.tasks.length !== initialLength) {
      await this.storageService.set(this.TASKS_KEY, this.tasks);
      this.tasksUpdate.next();
      return true;
    }
    return false;
  }

  addUpdateListener(callback: () => void) {
    return this.tasksUpdate.subscribe(callback);
  }

  removeUpdateListener(callback: () => void) {
    // Cette méthode n'est plus nécessaire avec RxJS, la désinscription se fait via le retour de subscribe
  }

  getImportanceLabel(importance?: string): string {
    switch (importance) {
      case 'low':
        return 'Faible';
      case 'medium':
        return 'Moyenne';
      case 'high':
        return 'Haute';
      default:
        return 'Non définie';
    }
  }

  getImportanceColor(importance?: string): string {
    switch (importance) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'danger';
      default:
        return 'medium';
    }
  }
}
