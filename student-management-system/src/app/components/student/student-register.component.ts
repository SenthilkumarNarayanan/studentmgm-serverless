import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css']
})
export class StudentRegisterComponent {
  regNo = '';
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  phone = '';
  address = '';
  
  loading = false;
  error = '';
  success = '';

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  isFormValid(): boolean {
    return !!(
      this.regNo &&
      this.name &&
      this.email &&
      this.password &&
      this.confirmPassword &&
      this.password === this.confirmPassword &&
      this.password.length >= 6
    );
  }

  onSubmit() {
    this.error = '';
    this.success = '';

    if (!this.regNo) {
      this.error = 'Registration number is required';
      return;
    }

    if (!this.name) {
      this.error = 'Name is required';
      return;
    }

    if (!this.email) {
      this.error = 'Email is required';
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    if (!this.password) {
      this.error = 'Password is required';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;

    const registrationPayload = {
      regNo: this.regNo,
      name: this.name,
      email: this.email,
      password: this.password,
      profile: {
        phone: this.phone || '',
        address: this.address || ''
      }
    };
    
    this.api.studentRegisterComplete(registrationPayload).subscribe({
      next: (res: any) => {
        this.success = res.message || 'Student registered successfully! Redirecting to login...';
        this.loading = false;
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed. Please check your registration number.';
        this.loading = false;
      }
    });
  }
}