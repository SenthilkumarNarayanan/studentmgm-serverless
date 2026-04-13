import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ApplyLeaveComponent } from './apply-leave.component';
import { NotificationsComponent } from '../shared/notifications.component'; // Import NotificationsComponent  
import { ToastService } from '../../services/toast.service'; // Import ToastService

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, ApplyLeaveComponent, NotificationsComponent], // Add NotificationsComponent
  template: `
    <div class="container-fluid p-0">
      <div class="row g-0">
        <!-- Sidebar -->
        <div class="col-auto" style="width: 280px;">
          <div class="sidebar p-3">
            <h4 class="mb-4">
              <i class="bi bi-person-badge"></i> Student Portal
            </h4>
            <nav class="nav flex-column">
              <a class="nav-link" [class.active]="activeTab === 'dashboard'" 
                 (click)="activeTab='dashboard'" href="javascript:void(0)">
                <i class="bi bi-house"></i> Dashboard
              </a>
              <a class="nav-link" [class.active]="activeTab === 'apply'" 
                 (click)="activeTab='apply'" href="javascript:void(0)">
                <i class="bi bi-calendar-plus"></i> Apply Leave
              </a>
              <a class="nav-link" [class.active]="activeTab === 'myLeaves'" 
                 (click)="activeTab='myLeaves'" href="javascript:void(0)">
                <i class="bi bi-list-check"></i> My Leaves
              </a>
              <!-- Add Notifications Tab -->
              <a class="nav-link" [class.active]="activeTab === 'notifications'" 
                 (click)="activeTab='notifications'" href="javascript:void(0)">
                <i class="bi bi-bell"></i> Notifications
                <span *ngIf="unreadNotificationsCount > 0" class="badge bg-danger ms-2">
                  {{ unreadNotificationsCount }}
                </span>
              </a>
            </nav>
            <hr class="my-3 bg-light">
            <button class="btn btn-outline-light w-100" (click)="logout()">
              <i class="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="col">
          <div class="navbar-top d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ getTitle() }}</h5>
            <div class="d-flex align-items-center">
              <span class="me-3">Welcome, {{ studentName }} ({{ regNo }})</span>
              <div class="avatar">{{ studentName?.charAt(0) }}</div>
            </div>
          </div>
          
          <div class="p-4">
            <!-- Dashboard Tab -->
            <div *ngIf="activeTab === 'dashboard'">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <div class="card p-3">
                    <h5 class="text-muted">My Leaves</h5>
                    <h2 class="mb-0">{{ myLeaves.length }}</h2>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <div class="card p-3">
                    <h5 class="text-muted">Pending Leaves</h5>
                    <h2 class="mb-0 text-warning">{{ pendingCount }}</h2>
                  </div>
                </div>
              </div>
              
              <div class="card mt-3">
                <div class="card-header bg-white">
                  <h6 class="mb-0">Recent Leave History</h6>
                </div>
                <div class="card-body">
                  <div *ngFor="let leave of myLeaves.slice(0, 5)" class="mb-3">
                    <div class="d-flex justify-content-between">
                      <div>
                        <strong>{{ leave.reason }}</strong>
                        <br>
                        <small>{{ leave.fromDate | date }} to {{ leave.toDate | date }}</small>
                      </div>
                      <span class="badge" [class.bg-warning]="leave.status === 'pending'"
                            [class.bg-success]="leave.status === 'approved'"
                            [class.bg-danger]="leave.status === 'rejected'">
                        {{ leave.status }}
                      </span>
                    </div>
                    <hr>
                  </div>
                  <div *ngIf="myLeaves.length === 0" class="text-center text-muted">
                    No leave applications yet
                  </div>
                </div>
              </div>
            </div>

            <!-- Apply Leave Tab -->
            <div *ngIf="activeTab === 'apply'">
              <app-apply-leave (leaveApplied)="loadMyLeaves()"></app-apply-leave>
            </div>

            <!-- My Leaves Tab -->
            <div *ngIf="activeTab === 'myLeaves'">
              <div class="card">
                <div class="card-header bg-white">
                  <h5 class="mb-0">My Leave Applications</h5>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Reason</th>
                          <th>From Date</th>
                          <th>To Date</th>
                          <th>Status</th>
                          <th>Applied On</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let leave of myLeaves">
                          <td>{{ leave.reason }}</td>
                          <td>{{ leave.fromDate | date }}</td>
                          <td>{{ leave.toDate | date }}</td>
                          <td>
                            <span class="badge" [class.bg-warning]="leave.status === 'pending'"
                                  [class.bg-success]="leave.status === 'approved'"
                                  [class.bg-danger]="leave.status === 'rejected'">
                              {{ leave.status }}
                            </span>
                           </td>
                          <td>{{ leave.createdAt | date }}</td>
                        </tr>
                        <tr *ngIf="myLeaves.length === 0">
                          <td colspan="5" class="text-center">No leave applications found</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notifications Tab -->
            <div *ngIf="activeTab === 'notifications'">
              <app-notifications 
                [notifications]="notifications"
                [isAdmin]="false"
                (createNotification)="onCreateNotification($event)"
                (deleteNotification)="onDeleteNotification($event)">
              </app-notifications>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      min-height: 100vh;
      background: linear-gradient(135deg, #1e2a3a 0%, #0f1724 100%);
      color: white;
    }
    .sidebar .nav-link {
      color: rgba(255,255,255,0.8);
      padding: 12px 20px;
      margin: 4px 0;
      border-radius: 8px;
      cursor: pointer;
      position: relative;
    }
    .sidebar .nav-link:hover,
    .sidebar .nav-link.active {
      background: rgba(255,255,255,0.15);
      color: white;
    }
    .sidebar .nav-link i {
      margin-right: 12px;
    }
    .navbar-top {
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      padding: 12px 24px;
    }
    .avatar {
      width: 40px;
      height: 40px;
      background: #4361ee;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    .card {
      border: none;
      border-radius: 16px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.05);
      margin-bottom: 20px;
    }
    .badge.bg-danger {
      background-color: #dc3545 !important;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 10px;
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  activeTab = 'dashboard';
  myLeaves: any[] = [];
  notifications: any[] = []; // Add notifications array
  studentName = '';
  regNo = '';

  constructor(private api: ApiService, private router: Router, private toastService: ToastService) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.studentName = user.name || 'Student';
    this.regNo = user.regNo || '';
    this.loadMyLeaves();
    this.loadNotifications();// Load notifications on init
  }

  loadMyLeaves() {
    this.api.getMyLeaves().subscribe({
      next: (res: any) => {
        this.myLeaves = res.data || [];
        console.log('Leaves loaded:', this.myLeaves);
      },
      error: (err) => {
        this.toastService.show('error', 'Error', 'Failed to load leave applications');
        console.error('Error loading leaves:', err);
      }
    });
  }

  // Add method to load notifications
  loadNotifications() {
    this.api.getStudentNotifications().subscribe({
      next: (res: any) => {
        this.notifications = res.data || [];
        console.log('Notifications loaded:', this.notifications);
        this.toastService.show('success', 'Notifications Loaded', 'Your notifications have been loaded successfully.');
      },
      error: (err) => {
        this.toastService.show('error', 'Error', 'Failed to load notifications');
        console.error('Error loading notifications:', err);
      }
    });
  }

  // Handle notification creation (though students can't create, keeping for consistency)
  onCreateNotification(notification: any) {
    this.api.createNotification(notification).subscribe({
      next: (res: any) => {
        this.loadNotifications(); // Refresh list
      },
      error: (err) => {
        this.toastService.show('error', 'Error', 'Failed to create notification');
        console.error('Error creating notification:', err);
      }
    });
  }

  // Handle notification deletion (though students can't delete, keeping for consistency)
  onDeleteNotification(id: string) {
    this.api.deleteNotification(id).subscribe({
      next: (res: any) => {
        this.loadNotifications(); // Refresh list
      },
      error: (err) => {
        console.error('Error deleting notification:', err);
      }
    });
  }

  // Calculate unread notifications (you'll need to add a 'read' field to your notification model)
  get unreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  get pendingCount(): number {
    return this.myLeaves.filter(l => l.status === 'pending').length;
  }

  getTitle(): string {
    const titles: any = {
      dashboard: 'Dashboard',
      apply: 'Apply Leave',
      myLeaves: 'My Leaves',
      notifications: 'Notifications'
    };
    return titles[this.activeTab] || 'Student Portal';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}