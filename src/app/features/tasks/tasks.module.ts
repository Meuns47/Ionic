import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TaskListPage } from './pages/task-list/task-list.page';
import { TaskAddPage } from './pages/task-add/task-add.page';

const routes: Routes = [
  {
    path: '',
    component: TaskListPage
  }
];

@NgModule({
  declarations: [
    TaskListPage,
    TaskAddPage
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TasksModule { }
