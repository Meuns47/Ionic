import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TaskService } from '../../features/tasks/services/task.service';
import { ToastService } from '../services/toast.service';

export const taskExistsGuard: CanActivateFn = async (route) => {
  const taskService = inject(TaskService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const id = route.params['id'];
  if (!id) {
    await toastService.showError('ID de tâche invalide');
    router.navigate(['/tasks']);
    return false;
  }

  try {
    const task = await taskService.getTaskById(Number(id));
    if (!task) {
      await toastService.showError('Tâche non trouvée');
      router.navigate(['/tasks']);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification de la tâche:', error);
    await toastService.showError('Erreur lors de la vérification de la tâche');
    router.navigate(['/tasks']);
    return false;
  }
};
