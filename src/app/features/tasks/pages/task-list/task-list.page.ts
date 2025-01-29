import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TaskAddPage } from '../task-add/task-add.page';
import { TaskService } from '../../services/task.service';
import { Task } from '../../../../models/task.model';

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
    
    modal.onDidDismiss().then(async (result) => {
      if (result.data?.task) {
        await this.taskService.addTask(result.data.task);
      }
    });

    return await modal.present();
  }

  async editTask(task: Task) {
    const modal = await this.modalController.create({
      component: TaskAddPage,
      cssClass: 'my-custom-modal',
      componentProps: {
        isEditing: true,
        taskToEdit: { ...task }
      }
    });
    
    modal.onDidDismiss().then(async (result) => {
      if (result.data?.task && task.id !== undefined) {
        await this.taskService.updateTask(task.id, result.data.task);
      }
    });

    return await modal.present();
  }

  getImportanceColor(importance: Task['importance']): string {
    switch (importance) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
      default:
        return 'success';
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
          handler: async () => {
            if (task.id !== undefined) {
              await this.taskService.deleteTask(task.id);
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
