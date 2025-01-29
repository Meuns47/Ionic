import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonSelect, 
  IonSelectOption, 
  IonButton, 
  IonBackButton, 
  IonButtons,
  IonNote,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  IonTextarea
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.page.html',
  styleUrls: ['./task-add.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonBackButton,
    IonButtons,
    IonNote,
    IonDatetimeButton,
    IonModal,
    IonDatetime
  ]
})
export class TaskAddPage implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId?: number;
  
  statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'todo', label: 'À faire' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'done', label: 'Terminé' }
  ];

  importanceOptions = [
    { value: 'low', label: 'Basse' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'high', label: 'Haute' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      dueDate: [new Date().toISOString()],
      status: ['todo', [Validators.required]],
      importance: ['medium', [Validators.required]]
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.taskId = Number(id);
      await this.loadTask();
    }
  }

  async loadTask() {
    if (!this.taskId) return;

    try {
      const task = await this.taskService.getTaskById(this.taskId);
      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status,
          importance: task.importance
        });
      } else {
        await this.toastService.showError('Tâche non trouvée');
        this.router.navigate(['/tasks']);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la tâche:', error);
      await this.toastService.showError('Erreur lors du chargement de la tâche');
      this.router.navigate(['/tasks']);
    }
  }

  async onSubmit() {
    if (this.taskForm.invalid) {
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    try {
      const taskData: Task = {
        ...this.taskForm.value,
        id: this.isEditMode ? this.taskId : undefined,
        createdAt: new Date()
      };

      if (this.isEditMode && this.taskId) {
        await this.taskService.updateTask(this.taskId, taskData);
        await this.toastService.showSuccess('Tâche mise à jour avec succès');
      } else {
        await this.taskService.addTask(taskData);
        await this.toastService.showSuccess('Tâche créée avec succès');
      }

      this.router.navigate(['/tasks']);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('tasks-updated'));
      }, 100);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      await this.toastService.showError('Erreur lors de la sauvegarde de la tâche');
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.taskForm.get(controlName);
    if (!control) return '';
    
    if (control.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control.hasError('minlength')) {
      return 'Le titre doit contenir au moins 3 caractères';
    }
    return '';
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }
}
