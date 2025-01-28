import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TaskAddPage } from '../task-add/task-add.page';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
  standalone: false
})
export class TaskListPage implements OnInit {
  tasks: Task[] = [];

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  async openAddTaskModal() {
    const modal = await this.modalController.create({
      component: TaskAddPage,
      cssClass: 'my-custom-modal'
    });
    
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.task) {
      this.taskService.addTask(data.task);
    }
  }

  async deleteTask(task: Task) {
    const alert = await this.alertController.create({
      header: 'Confirmer la suppression',
      message: 'Voulez-vous vraiment supprimer cette tâche ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.taskService.deleteTask(task.id);
          }
        }
      ]
    });
    await alert.present();
  }

  getImportanceColor(importance: string): string {
    switch (importance) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'medium';
    }
  }

  updateTaskCompletion(task: Task) {
    this.taskService.updateTaskCompletion(task.id, task.completed);
  }
}
