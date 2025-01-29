import { Routes } from '@angular/router';
import { TaskListPage } from './pages/task-list/task-list.page';
import { TaskAddPage } from './pages/task-add/task-add.page';
import { taskExistsGuard } from '../../core/guards/task-exists.guard';
import { TodoTasksComponent } from './todo-tasks/todo-tasks.component';
import { InProgressTasksComponent } from './in-progress-tasks/in-progress-tasks.component';
import { CompletedTasksComponent } from './completed-tasks/completed-tasks.component';
import { AllTasksComponent } from './all-tasks/all-tasks.component';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    component: TaskListPage,
    children: [
      {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full'
      },
      {
        path: 'all',
        component: AllTasksComponent
      },
      {
        path: 'todo',
        component: TodoTasksComponent
      },
      {
        path: 'in-progress',
        component: InProgressTasksComponent
      },
      {
        path: 'completed',
        component: CompletedTasksComponent
      }
    ]
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
