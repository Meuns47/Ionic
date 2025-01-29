import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { ToastService } from '../../../../core/services/toast.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-todo-tasks',
  templateUrl: './todo-tasks.component.html',
  styleUrls: ['./todo-tasks.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class TodoTasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private tasksSubscription?: Subscription;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.tasksSubscription = this.taskService.addUpdateListener(() => this.loadTasks());
  }

  ngOnDestroy() {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  async loadTasks() {
    this.tasks = await this.taskService.getTasks();
    this.tasks = this.tasks.filter(task => task.status === 'todo');
  }

  getImportanceLabel(importance?: string): string {
    return this.taskService.getImportanceLabel(importance);
  }

  getImportanceColor(importance?: string): string {
    return this.taskService.getImportanceColor(importance);
  }

  editTask(id: number) {
    this.router.navigate(['tasks', 'edit', id]);
  }

  async confirmDelete(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer cette tâche ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.deleteTask(id);
          }
        }
      ]
    });

    await alert.present();
  }

  private async deleteTask(id: number) {
    const success = await this.taskService.deleteTask(id);
    if (success) {
      this.toastService.showSuccess('Tâche supprimée avec succès');
      await this.loadTasks();
    }
  }
}
