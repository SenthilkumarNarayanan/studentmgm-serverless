import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-enroll-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header bg-white">
        <h5 class="mb-0">Enroll New Student</h5>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          <i class="bi bi-info-circle"></i> 
          Enrolled students get auto-generated Registration Number (SN1000 format)
        </div>
        
        <form (ngSubmit)="enroll()">
          <div class="mb-3">
            <label class="form-label">Full Name *</label>
            <input type="text" class="form-control" [(ngModel)]="name" 
                   name="name" required placeholder="Enter student's full name">
          </div>
          
          <div class="mb-3">
            <label class="form-label">Email Address *</label>
            <input type="email" class="form-control" [(ngModel)]="email" 
                   name="email" required placeholder="student@example.com">
          </div>
          
          <button type="submit" class="btn btn-primary" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i class="bi bi-person-plus"></i> Enroll Student
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
export class EnrollStudentComponent {
  name = '';
  email = '';
  loading = false;
  successMsg = '';
  errorMsg = '';
  
  @Output() enrolled = new EventEmitter<void>();

  constructor(private api: ApiService) {}

  enroll() {
    if (!this.name || !this.email) {
      this.errorMsg = 'Please fill all required fields';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.api.enrollStudent({ name: this.name, email: this.email }).subscribe({
      next: (res: any) => {
        this.successMsg = `Student enrolled successfully! Registration Number: ${res.RegNo}`;
        this.name = '';
        this.email = '';
        this.enrolled.emit();
        
        setTimeout(() => {
          this.successMsg = '';
        }, 5000);
        
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Enrollment failed. Please try again.';
        this.loading = false;
        
        setTimeout(() => {
          this.errorMsg = '';
        }, 1000);
      }
    });
  }
}