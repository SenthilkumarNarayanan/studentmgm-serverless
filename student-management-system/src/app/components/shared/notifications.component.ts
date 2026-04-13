import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="bi bi-bell"></i> Notifications
        </h5>
        <button *ngIf="isAdmin" class="btn btn-primary btn-sm" (click)="showForm = !showForm">
          <i class="bi bi-plus-lg"></i> Create Notification
        </button>
      </div>
      
      <div class="card-body">
        <!-- Create Notification Form -->
        <div *ngIf="showForm && isAdmin" class="mb-4 p-3 border rounded bg-light">
          <h6 class="mb-3">New Notification</h6>
          <div class="mb-2">
            <input class="form-control" placeholder="Title" 
                   [(ngModel)]="newNotification.title">
          </div>
          <div class="mb-2">
            <textarea class="form-control" placeholder="Description" 
                      rows="2" [(ngModel)]="newNotification.description"></textarea>
          </div>
          <div class="mb-2">
            <input class="form-control" placeholder="File URL (optional)" 
                   [(ngModel)]="newNotification.fileUrl">
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-success btn-sm" (click)="create()">
              <i class="bi bi-send"></i> Publish
            </button>
            <button class="btn btn-secondary btn-sm" (click)="showForm=false">
              Cancel
            </button>
          </div>
        </div>
        
        <!-- Notifications List -->
        <div *ngFor="let n of notifications; let i = index" class="notification-item">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <h6 class="mb-1">{{ n.title }}</h6>
              <p class="mb-1 text-muted">{{ n.description }}</p>
              <small class="text-muted">
                <i class="bi bi-clock"></i> {{ n.createdAt | date:'medium' }}
              </small>
              <div *ngIf="n.fileUrl" class="mt-2">
                <a [href]="n.fileUrl" target="_blank" class="file-link">
                  <i class="bi bi-file-earmark"></i> View Attachment
                </a>
              </div>
            </div>
            <button *ngIf="isAdmin" class="btn btn-sm btn-outline-danger ms-3" 
                    (click)="confirmDelete(n._id, n.title)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        
        <div *ngIf="notifications.length === 0" class="text-center text-muted py-4">
          <i class="bi bi-bell-slash fs-1"></i>
          <p class="mt-2">No notifications yet</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-item {
      border-left: 4px solid #4361ee;
      background: white;
      padding: 15px;
      margin-bottom: 12px;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
    }
    .notification-item:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .file-link {
      text-decoration: none;
      color: #4361ee;
      font-weight: 500;
    }
    .file-link:hover {
      text-decoration: underline;
    }
  `]
})
export class NotificationsComponent {
  @Input() notifications: any[] = [];
  @Input() isAdmin = false;
  @Output() createNotification = new EventEmitter<any>();
  @Output() deleteNotification = new EventEmitter<string>();

  constructor(private toastService: ToastService) {}

  showForm = false;
  newNotification = { title: '', description: '', fileUrl: '' };

  create() {
    if (this.newNotification.title && this.newNotification.description) {
      this.createNotification.emit(this.newNotification);
      this.newNotification = { title: '', description: '', fileUrl: '' };
      this.showForm = false;
      this.toastService.show('success', 'Notification Created', 'Notification created successfully');
    }
  }

  confirmDelete(id: string, title: string) {
    if (confirm(`Are you sure you want to delete notification: "${title}"?`)) {
      this.deleteNotification.emit(id);
      this.toastService.show('success', 'Notification Deleted', 'Notification deleted successfully'); 
    }
  }
}