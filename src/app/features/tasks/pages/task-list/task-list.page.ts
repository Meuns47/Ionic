import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItemSliding, 
  IonItem, 
  IonLabel, 
  IonChip, 
  IonIcon, 
  IonButton, 
  IonButtons,
  IonNote,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash } from 'ionicons/icons';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonChip,
    IonIcon,
    IonButton,
    IonButtons,
    IonNote
  ]
})
export class TaskListPage implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private tasksUpdateHandler = () => this.loadTasks();

  constructor(
    private taskService: TaskService,
    private router: Router,
    private toastService: ToastService,
    private alertController: AlertController
  ) {
    addIcons({ add, create, trash });
  }

  ngOnInit() {
    this.loadTasks();
    window.addEventListener('tasks-updated', this.tasksUpdateHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('tasks-updated', this.tasksUpdateHandler);
  }

  ionViewWillEnter() {
    this.loadTasks();
  }

  async loadTasks() {
    try {
      this.tasks = await this.taskService.getTasks();
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      await this.toastService.showError('Erreur lors du chargement des tâches');
    }
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case 'todo':
        return 'warning';
      case 'in_progress':
        return 'primary';
      case 'done':
        return 'success';
      default:
        return 'medium';
    }
  }

  getStatusLabel(status: TaskStatus): string {
    const statusMap = {
      todo: 'À faire',
      in_progress: 'En cours',
      done: 'Terminé'
    };
    return statusMap[status] || status;
  }

  getImportanceColor(importance: 'low' | 'medium' | 'high' | undefined): string {
    if (!importance) return 'medium';
    const importanceMap = {
      low: 'success',
      medium: 'warning',
      high: 'danger'
    };
    return importanceMap[importance];
  }

  getImportanceLabel(importance: 'low' | 'medium' | 'high' | undefined): string {
    if (!importance) return 'Non définie';
    const importanceMap = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute'
    };
    return importanceMap[importance];
  }

  addTask() {
    this.router.navigate(['/tasks/add']);
  }

  editTask(taskId: number) {
    this.router.navigate(['/tasks/edit', taskId]);
  }

  async confirmDelete(taskId: number) {
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
            this.deleteTask(taskId);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteTask(taskId: number) {
    try {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      await this.taskService.deleteTask(taskId);
      await this.toastService.showSuccess('Tâche supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      await this.toastService.showError('Erreur lors de la suppression de la tâche');
      await this.loadTasks();
    }
  }
}
