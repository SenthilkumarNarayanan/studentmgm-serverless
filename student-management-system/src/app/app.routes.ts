import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { AdminRegisterComponent } from './components/admin/admin-register.component';
import { StudentDashboardComponent } from './components/student/student-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { StudentRegisterComponent } from './components/student/student-register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'student/register', component: StudentRegisterComponent },
  { path: 'admin/register', component: AdminRegisterComponent },
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'admin' } 
  },
  { 
    path: 'student', 
    component: StudentDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { role: 'student' } 
  },
  { path: '**', redirectTo: '/login' }
];