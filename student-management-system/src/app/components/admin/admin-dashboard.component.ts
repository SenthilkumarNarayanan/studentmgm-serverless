import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab = 'dashboard';
  leaves: any[] = [];
  students: any[] = [];
  notifications: any[] = [];
  loadingLeaves = false;
  loadingStudents = false;
  updatingLeaveId: string | null = null;
  adminName = 'Admin';
  message = '';
  messageType = 'success';
  loading = false;
  showNotificationForm = false;
  newNotification = {
    title: '',
    description: '',
    fileUrl: ''
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    
    if (tab === 'dashboard') {
      this.loadDashboardData();
    } else if (tab === 'enroll') {
      // Nothing to load for enroll tab
      console.log('Enroll tab selected');
    } else if (tab === 'leaves') {
      this.loadLeaves();
    } else if (tab === 'students') {
      this.loadStudents();
    } else if (tab === 'notifications') {
      this.loadNotifications();
    }
  }

  loadDashboardData() {
    this.loadLeaves();
    this.loadStudents();
    this.loadNotifications();
  }

  loadLeaves() {
    this.loadingLeaves = true;
    this.api.getAllLeaves().subscribe({
      next: (res: any) => {
        this.leaves = res.data || [];
        console.log('Leaves loaded:', this.leaves.length);
        this.loadingLeaves = false;
      },
      error: (err: any) => {
        console.error('Error loading leaves:', err);
        this.toastService.error('Error', 'Failed to load leave requests');
        this.loadingLeaves = false;
      }
    });
  }

  loadStudents() {
    this.loadingStudents = true;
    this.api.getAllStudents().subscribe({
      next: (res: any) => {
        this.students = res.data || [];
        console.log('Students loaded:', this.students.length);
        console.log('Student data:', this.students); // Debug log
        this.loadingStudents = false;
      },
      error: (err: any) => {
        console.error('Error loading students:', err);
        this.toastService.error('Error', 'Failed to load students');
        this.loadingStudents = false;
      }
    });
  }

  loadNotifications() {
    this.api.getAdminNotifications().subscribe({
      next: (res: any) => {
        this.notifications = res.data || [];
        console.log('Notifications loaded:', this.notifications.length);
      },
      error: (err: any) => {
        console.error('Error loading notifications:', err);
        this.toastService.error('Error', 'Failed to load notifications');
      }
    });
  }

  enrollStudent(form: any) {
    if (form.invalid) {
      this.toastService.error('Error', 'Please fill all required fields');
      return;
    }
    
    this.loading = true;
    this.api.enrollStudent(form.value).subscribe({
      next: (res: any) => {
        console.log('Enroll response:', res);
        this.toastService.success('Success', 'Student enrolled successfully!');
        this.loadStudents(); // Refresh student list
        form.reset(); // Reset form
        this.activeTab = 'students'; // Switch to students tab
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error enrolling student:', err);
        this.toastService.error('Error', err.error?.message || 'Failed to enroll student');
        this.loading = false;
      }
    });
  }

  updateLeaveStatus(leaveId: string, status: string) {
    this.updatingLeaveId = leaveId;
    
    console.log(`Updating leave ${leaveId} to status: ${status}`);
    
    this.api.updateLeaveStatus(leaveId, status).subscribe({
      next: (res: any) => {
        console.log('Update response:', res);
        
        this.toastService.success(
          'Status Updated', 
          `Leave ${status} successfully!`
        );
        
        this.updatingLeaveId = null;
        this.loadLeaves(); // Reload leaves
        
        if (this.activeTab === 'dashboard') {
          this.loadDashboardData();
        }
      },
      error: (err: any) => {
        console.error('Error updating leave status:', err);
        
        const errorMsg = err.error?.message || 'Failed to update leave status';
        this.toastService.error('Update Failed', errorMsg);
        
        this.updatingLeaveId = null;
      }
    });
  }

  toggleBlockStudent(studentId: string, block: boolean) {
    const action = block ? 'block' : 'unblock';
    
    this.api[block ? 'blockStudent' : 'unblockStudent'](studentId).subscribe({
      next: () => {
        this.toastService.success(
          'Success', 
          `Student ${action}ed successfully!`
        );
        this.loadStudents(); // Reload the list
      },
      error: (err: any) => {
        console.error(`Error ${action}ing student:`, err);
        this.toastService.error(
          'Error', 
          err.error?.message || `Failed to ${action} student`
        );
      }
    });
  }

  toggleBlock(s: any) {
    this.toggleBlockStudent(s._id, !s.isBlocked);
  }

  createNotification() {
    if (!this.newNotification.title || !this.newNotification.description) {
      this.toastService.error('Error', 'Title and description are required');
      return;
    }
    
    this.api.createNotification(this.newNotification).subscribe({
      next: (res: any) => {
        console.log('Notification created:', res);
        this.toastService.success('Success', 'Notification created successfully!');
        this.loadNotifications();
        this.showNotificationForm = false;
        this.newNotification = { title: '', description: '', fileUrl: '' };
      },
      error: (err: any) => {
        console.error('Error creating notification:', err);
        this.toastService.error('Error', 'Failed to create notification');
      }
    });
  }

  deleteNotification(id: string) {
    if (confirm('Are you sure you want to delete this notification?')) {
      this.api.deleteNotification(id).subscribe({
        next: (res: any) => {
          console.log('Notification deleted:', res);
          this.toastService.success('Success', 'Notification deleted successfully!');
          this.loadNotifications();
        },
        error: (err: any) => {
          console.error('Error deleting notification:', err);
          this.toastService.error('Error', 'Failed to delete notification');
        }
      });
    }
  }

  getPendingCount(): number {
    return this.leaves.filter(leave => leave.status === 'pending').length;
  }

  getStudentName(leave: any): string {
    return leave.studentId?.name || 'Unknown Student';
  }

  getTitle(): string {
    const titles: any = {
      dashboard: 'Dashboard',
      enroll: 'Enroll New Student',
      leaves: 'Leave Requests',
      notifications: 'Notifications',
      students: 'Manage Students'
    };
    return titles[this.activeTab] || 'Admin Portal';
  }

  logout() {
    this.toastService.info('Logged Out', 'You have been successfully logged out');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}