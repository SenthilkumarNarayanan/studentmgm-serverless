// toast.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1050">
      <div *ngFor="let toast of toasts" 
           class="toast show" 
           role="alert" 
           [class]="getToastClass(toast.type)"
           [ngStyle]="{'animation': 'slideIn 0.3s ease-out'}">
        <div class="toast-header" [class]="getHeaderClass(toast.type)">
          <i class="bi" [class]="getIconClass(toast.type)"></i>
          <strong class="me-auto ms-2">{{ toast.title }}</strong>
          <button type="button" class="btn-close" (click)="removeToast(toast.id)"></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
      min-width: 300px;
    }
    
    .toast {
      margin-bottom: 10px;
      border: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-radius: 8px;
      overflow: hidden;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .toast-header {
      border-bottom: none;
      padding: 12px 15px;
    }
    
    .toast-header-success {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
    }
    
    .toast-header-error {
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: white;
    }
    
    .toast-header-info {
      background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
      color: white;
    }
    
    .toast-header-warning {
      background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
      color: #000;
    }
    
    .btn-close {
      filter: brightness(0) invert(1);
    }
    
    .toast-body {
      padding: 12px 15px;
      background: white;
      color: #333;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toasts$.subscribe(toast => {
      this.toasts.push(toast);
      
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          this.removeToast(toast.id);
        }, toast.duration);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeToast(id: number) {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      this.toasts.splice(index, 1);
    }
  }

  getToastClass(type: string): string {
    return `toast-${type}`;
  }

  getHeaderClass(type: string): string {
    switch(type) {
      case 'success': return 'toast-header-success';
      case 'error': return 'toast-header-error';
      case 'info': return 'toast-header-info';
      case 'warning': return 'toast-header-warning';
      default: return '';
    }
  }

  getIconClass(type: string): string {
    switch(type) {
      case 'success': return 'bi-check-circle-fill';
      case 'error': return 'bi-exclamation-triangle-fill';
      case 'info': return 'bi-info-circle-fill';
      case 'warning': return 'bi-exclamation-circle-fill';
      default: return 'bi-bell-fill';
    }
  }
}