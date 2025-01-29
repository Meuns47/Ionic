import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from '../../../../models/task.model';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.page.html',
  styleUrls: ['./task-add.page.scss'],
  standalone: false
})
export class TaskAddPage implements OnInit {
  @Input() isEditing = false;
  @Input() taskToEdit?: Task;

  task: Partial<Task> = {
    title: '',
    description: '',
    importance: 'low',
    dueDate: new Date().toISOString(),
    completed: false
  };

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    if (this.isEditing && this.taskToEdit) {
      this.task = { ...this.taskToEdit };
    }
  }

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
