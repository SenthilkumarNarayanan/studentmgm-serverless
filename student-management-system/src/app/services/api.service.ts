import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  // Auth APIs
  adminLogin(email: string, password: string): Observable<any> {
    return this.http.post(`/api/v1/auth/admin/login`, { email, password });
  }

  adminRegister(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`/api/v1/auth/admin/register`, { name, email, password });
  }

  // Student Register - FIXED: Accept object parameter
  studentRegisterComplete(registrationData: {
    regNo: string;
    name: string;
    email: string;
    password: string;
    profile?: { phone: string; address: string };
  }): Observable<any> {
    return this.http.post(`/api/v1/auth/student/register`, registrationData);
  }

  studentLogin(email: string, password: string): Observable<any> {
    return this.http.post(`/api/v1/auth/student/login`, { email, password });
  }

  // Admin APIs
  enrollStudent(data: any): Observable<any> {
    return this.http.post(`/api/v1/admin/student_enroll/`, data);
  }

  getAllLeaves(): Observable<any> {
    return this.http.get(`/api/v1/admin/leaves`);
  }

  updateLeaveStatus(leaveId: string, status: string): Observable<any> {
    return this.http.put(`/api/v1/admin/leave/${leaveId}`, { status });
  }

  getAdminNotifications(): Observable<any> {
    return this.http.get(`/api/v1/admin/notification`);
  }

  createNotification(data: any): Observable<any> {
    return this.http.post(`/api/v1/admin/notification`, data);
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`/api/v1/admin/notification/${id}`);
  }
 markNotificationAsRead(id: string): Observable<any> {
  return this.http.put(`/api/v1/student/notifications/${id}/read`, {});
}
  getAllStudents(): Observable<any> {
    return this.http.get(`/api/v1/admin/students`);
  }

  blockStudent(id: string): Observable<any> {
    return this.http.put(`/api/v1/admin/block/${id}`, {});
  }

  unblockStudent(id: string): Observable<any> {
    return this.http.put(`/api/v1/admin/unblock/${id}`, {});
  }

  // Student APIs
  getMyLeaves(): Observable<any> {
    return this.http.get(`/api/v1/student/leave`);
  }

  applyLeave(data: any): Observable<any> {
    console.log('Sending leave data to backend:', data);
    return this.http.post(`/api/v1/student/leave`, data);
  }

  getStudentNotifications(): Observable<any> {
    return this.http.get(`/api/v1/student/notifications`);
  }
    getNotifications(): Observable<any> {
    return this.getStudentNotifications();
  }


  updateProfile(data: any): Observable<any> {
    return this.http.put(`/api/v1/student/profile/`, data);
  }
}