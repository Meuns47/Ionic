import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../../../models/task.model';
import { StorageService } from '../../../core/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private nextId = 1;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private readonly TASKS_KEY = 'tasks';
  private readonly TASK_ID_KEY = 'nextTaskId';
  private initialized = false;

  constructor(private storageService: StorageService) {
    this.init();
  }

  /**
   * Initialise le service et charge les données
   */
  private async init() {
    if (this.initialized) return;
    
    try {
      await this.initTasks();
      this.initialized = true;
      console.log('TaskService initialized successfully');
    } catch (error) {
      console.error('Error initializing TaskService:', error);
    }
  }

  /**
   * Initialise les tâches depuis le stockage
   */
  private async initTasks() {
    // Récupérer les tâches stockées
    const storedTasks = await this.storageService.get(this.TASKS_KEY);
    if (storedTasks) {
      this.tasks = storedTasks;
      console.log('Loaded tasks:', this.tasks);
    }
    
    // Récupérer le dernier ID utilisé
    const lastId = await this.storageService.get(this.TASK_ID_KEY);
    if (lastId) {
      this.nextId = lastId;
      console.log('Loaded last ID:', this.nextId);
    }
    
    // Mettre à jour le BehaviorSubject
    this.tasksSubject.next([...this.tasks]);
  }

  /**
   * Récupère la liste des tâches
   */
  getTasks(): Observable<Task[]> {
    // S'assurer que les données sont chargées
    if (!this.initialized) {
      this.init();
    }
    return this.tasksSubject.asObservable();
  }

  /**
   * Ajoute une nouvelle tâche
   */
  async addTask(task: Omit<Task, 'id'>): Promise<void> {
    // S'assurer que les données sont chargées
    if (!this.initialized) {
      await this.init();
    }

    const newTask: Task = {
      id: this.nextId++,
      ...task
    };
    this.tasks.unshift(newTask);
    
    try {
      // Persister les données
      await this.storageService.set(this.TASKS_KEY, this.tasks);
      await this.storageService.set(this.TASK_ID_KEY, this.nextId);
      console.log('Task added and saved:', newTask);
      
      this.tasksSubject.next([...this.tasks]);
    } catch (error) {
      console.error('Error saving task:', error);
      // Annuler les changements en cas d'erreur
      this.nextId--;
      this.tasks.shift();
      throw error;
    }
  }

  /**
   * Met à jour une tâche
   */
  async updateTask(taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): Promise<void> {
    // S'assurer que les données sont chargées
    if (!this.initialized) {
      await this.init();
    }

    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const oldTask = { ...this.tasks[taskIndex] };
      this.tasks[taskIndex] = {
        ...oldTask,
        ...updatedTask,
        id: taskId
      };
      
      try {
        // Persister les données
        await this.storageService.set(this.TASKS_KEY, this.tasks);
        console.log('Task updated and saved:', this.tasks[taskIndex]);
        
        this.tasksSubject.next([...this.tasks]);
      } catch (error) {
        console.error('Error updating task:', error);
        // Annuler les changements en cas d'erreur
        this.tasks[taskIndex] = oldTask;
        throw error;
      }
    }
  }

  /**
   * Supprime une tâche
   */
  async deleteTask(taskId: number): Promise<void> {
    // S'assurer que les données sont chargées
    if (!this.initialized) {
      await this.init();
    }

    const oldTasks = [...this.tasks];
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    
    try {
      // Persister les données
      await this.storageService.set(this.TASKS_KEY, this.tasks);
      console.log('Task deleted and saved, id:', taskId);
      
      this.tasksSubject.next([...this.tasks]);
    } catch (error) {
      console.error('Error deleting task:', error);
      // Annuler les changements en cas d'erreur
      this.tasks = oldTasks;
      throw error;
    }
  }
}
