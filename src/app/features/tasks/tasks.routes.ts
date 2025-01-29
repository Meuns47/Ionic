import { Routes } from '@angular/router';
import { TaskListPage } from './pages/task-list/task-list.page';
import { TaskAddPage } from './pages/task-add/task-add.page';
import { taskExistsGuard } from '../../core/guards/task-exists.guard';

export const routes: Routes = [
  {
    path: '',
    component: TaskListPage
  },
  {
    path: 'add',
    component: TaskAddPage
  },
  {
    path: 'edit/:id',
    component: TaskAddPage,
    canActivate: [taskExistsGuard]
  }
];

export const TASKS_ROUTES = routes;
