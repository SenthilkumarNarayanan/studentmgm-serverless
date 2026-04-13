import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header bg-white">
        <h5 class="mb-0">My Profile</h5>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-3">
            <label class="fw-bold">Registration Number</label>
          </div>
          <div class="col-md-9">
            <p class="form-control-plaintext">{{ profile.regNo }}</p>
          </div>
        </div>
        
        <div class="row mb-3">
          <div class="col-md-3">
            <label class="fw-bold">Full Name</label>
          </div>
          <div class="col-md-9">
            <p class="form-control-plaintext">{{ profile.name }}</p>
          </div>
        </div>
        
        <div class="row mb-3">
          <div class="col-md-3">
            <label class="fw-bold">Email Address</label>
          </div>
          <div class="col-md-9">
            <p class="form-control-plaintext">{{ profile.email }}</p>
          </div>
        </div>
        
        <hr>
        
        <h6 class="mb-3">Update Contact Details</h6>
        
        <form (ngSubmit)="update()">
          <div class="mb-3">
            <label class="form-label">Phone Number</label>
            <input type="tel" class="form-control" [(ngModel)]="phone" 
                   name="phone" placeholder="Enter your phone number">
          </div>
          
          <div class="mb-3">
            <label class="form-label">Address</label>
            <textarea class="form-control" rows="2" [(ngModel)]="address" 
                      name="address" placeholder="Enter your address"></textarea>
          </div>
          
          <button type="submit" class="btn btn-primary" [disabled]="updating">
            <span *ngIf="updating" class="spinner-border spinner-border-sm me-2"></span>
            <i class="bi bi-save"></i> Update Profile
          </button>
        </form>
        
        <div *ngIf="updateMsg" class="alert alert-success mt-3">
          <i class="bi bi-check-circle"></i> {{ updateMsg }}
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profile: any = { name: '', email: '', regNo: '' };
  phone = '';
  address = '';
  updating = false;
  updateMsg = '';
  
  @Output() profileUpdated = new EventEmitter<void>();

  constructor(private api: ApiService) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.profile = user;
    this.phone = user.profile?.phone || '';
    this.address = user.profile?.address || '';
  }

  update() {
    this.updating = true;
    this.updateMsg = '';

    this.api.updateProfile({ phone: this.phone, address: this.address }).subscribe({
      next: (res: any) => {
        localStorage.setItem('user', JSON.stringify(res.studentData));
        this.profile = res.studentData;
        this.updateMsg = 'Profile updated successfully!';
        this.profileUpdated.emit();
        this.updating = false;
        
        setTimeout(() => {
          this.updateMsg = '';
        }, 5000);
      },
      error: () => {
        this.updateMsg = 'Failed to update profile. Please try again.';
        this.updating = false;
        
        setTimeout(() => {
          this.updateMsg = '';
        }, 5000);
      }
    });
  }
}