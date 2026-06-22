import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { StudentDashboard } from './components/student-dashboard/student-dashboard';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AdminSubjectManage } from './components/admin-subject-manage/admin-subject-manage';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'student', component: StudentDashboard },
  { path: 'admin', component: AdminDashboard },
  { path: 'admin/subject/:id', component: AdminSubjectManage }
];