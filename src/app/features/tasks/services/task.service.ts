import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { StorageService } from '../../../core/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly TASKS_KEY = 'tasks';
  private tasks: Task[] = [];

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
  }

  async updateTask(id: number, updatedTask: Task): Promise<void> {
    await this.loadTasks();
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...updatedTask, id };
      await this.storageService.set(this.TASKS_KEY, this.tasks);
    }
  }

  async deleteTask(id: number): Promise<void> {
    await this.loadTasks();
    this.tasks = this.tasks.filter(task => task.id !== id);
    await this.storageService.set(this.TASKS_KEY, this.tasks);
  }
}
