import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header bg-white">
        <h5 class="mb-0">Apply for Leave</h5>
      </div>
      <div class="card-body">
        <form #leaveForm="ngForm" (ngSubmit)="applyLeave()">
          <div class="mb-3">
            <label class="form-label">Reason for Leave *</label>
            <textarea class="form-control" rows="3" [(ngModel)]="reason" 
                      name="reason" required 
                      placeholder="Please provide detailed reason for leave"></textarea>
          </div>
          
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">From Date *</label>
              <input type="date" class="form-control" [(ngModel)]="fromDate" 
                     name="fromDate" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">To Date *</label>
              <input type="date" class="form-control" [(ngModel)]="toDate" 
                     name="toDate" required>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary" [disabled]="loading || !leaveForm.valid">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i class="bi bi-send"></i> Submit Leave Request
          </button>
        </form>
        
        <div *ngIf="successMsg" class="alert alert-success mt-3">
          <i class="bi bi-check-circle"></i> {{ successMsg }}
        </div>
        
        <div *ngIf="errorMsg" class="alert alert-danger mt-3">
          <i class="bi bi-exclamation-triangle"></i> {{ errorMsg }}
        </div>
      </div>
    </div>
  `
})
export class ApplyLeaveComponent {
  reason = '';
  fromDate = '';
  toDate = '';
  loading = false;
  successMsg = '';
  errorMsg = '';
  
  @Output() leaveApplied = new EventEmitter<void>();

  constructor(private api: ApiService) {}

  applyLeave() {
    // Validation
    if (!this.reason || !this.fromDate || !this.toDate) {
      this.errorMsg = 'Please fill all required fields';
      return;
    }

    // Validate dates
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (from < today) {
      this.errorMsg = 'From date cannot be in the past';
      return;
    }
    
    if (from > to) {
      this.errorMsg = 'From date cannot be after to date';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    // Prepare data to send
    const leaveData = {
      reason: this.reason,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    console.log('Submitting leave data:', leaveData);

    this.api.applyLeave(leaveData).subscribe({
      next: (response: any) => {
        console.log('Leave application response:', response);
        this.successMsg = 'Leave application submitted successfully!';
        this.reason = '';
        this.fromDate = '';
        this.toDate = '';
        this.leaveApplied.emit();
        
        setTimeout(() => {
          this.successMsg = '';
        }, 5000);
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error applying leave:', err);
        this.errorMsg = err.error?.message || 'Failed to apply for leave. Please try again.';
        this.loading = false;
        
        setTimeout(() => {
          this.errorMsg = '';
        }, 5000);
      }
    });
  }
}