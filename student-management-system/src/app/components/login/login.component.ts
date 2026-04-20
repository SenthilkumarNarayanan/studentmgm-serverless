import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  role: 'admin' | 'student' = 'admin';
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private api: ApiService, 
    private router: Router,
    private toastService: ToastService
  ) {}

  switchRole(role: 'admin' | 'student') {
    this.role = role;
    this.error = '';
    this.email = '';
    this.password = '';
  }

  onSubmit() {
    // Clear previous error
    this.error = '';
    
    if (!this.email || !this.password) {
      this.toastService.show('error', 'Validation Error', 'Please fill all fields');
      return;
    }

    this.loading = true;
    console.log('Login attempt started, loading:', this.loading);

    const loginObservable = this.role === 'admin' 
      ? this.api.adminLogin(this.email, this.password)
      : this.api.studentLogin(this.email, this.password);
      console.log('api:', this.api);
      
    console.log('Login Observable:', loginObservable);
    
    loginObservable.subscribe({
      next: (res: any) => {
        console.log('Login success response:', res);
        
        // Store token and user data
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', this.role);
        localStorage.setItem('user', JSON.stringify(res.data || res.studentData));
        
        // Show success toast
        const userName = res.data?.name || res.studentData?.name || this.role;
        this.toastService.show('success', 'Login Successful', `Welcome back, ${userName}!`);
        
        // Navigate to dashboard
        this.router.navigate([`/${this.role}`]);
        
        // Note: Don't set loading false here because component might be destroyed on navigation
        // But for safety, we'll set it anyway
        this.loading = false;
      },
      error: (err) => {
        console.error('Login error details:', err);
        
        // CRITICAL: Reset loading state
        this.loading = false;
        
        // Extract error message properly
        let errorMessage = 'Login failed. Please check your credentials.';
        
        // Handle different error response structures
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.error) {
            errorMessage = err.error.error;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        // Set the error message for UI display
        this.error = errorMessage;
        
        // Show toast notification
        this.toastService.show('error', 'Login Failed', errorMessage);
        
        // Clear password field for security (optional)
        // this.password = '';
      }
      // Remove complete block as it's not needed and might cause issues
    });
  }
}