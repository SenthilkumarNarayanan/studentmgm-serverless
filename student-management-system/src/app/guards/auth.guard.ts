import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router) {}

  canActivate(route: any): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const requiredRole = route.data['role'];

    // Check if user is logged in
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if user has correct role
    if (requiredRole && role !== requiredRole) {
      this.router.navigate([`/${role}`]);
      return false;
    }

    return true;
  }
}