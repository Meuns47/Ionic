import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.page.html',
  styleUrls: ['./task-add.page.scss'],
  standalone: false
})
export class TaskAddPage {
  task: Partial<Task> = {
    title: '',
    description: '',
    importance: 'medium',
    dueDate: new Date().toISOString()
  };

  constructor(private modalController: ModalController) {}

  onSubmit() {
    if (this.task.title?.trim()) {
      this.modalController.dismiss({
        task: this.task
      });
    }
  }

  cancel() {
    this.modalController.dismiss();
  }
}
