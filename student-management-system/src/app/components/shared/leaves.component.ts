import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header bg-white fw-bold">
        <i class="bi bi-calendar-check"></i> Leave Applications
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Student</th>
                <th>Reason</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Status</th>
                <th *ngIf="isAdmin">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let leave of leaves">
                <td>
                  <strong>{{ getStudentName(leave) }}</strong>
                  <br>
                  <small class="text-muted">{{ getStudentReg(leave) }}</small>
                </td>
                <td>{{ leave.reason }}</td>
                <td>{{ leave.fromDate | date:'dd/MM/yyyy' }}</td>
                <td>{{ leave.toDate | date:'dd/MM/yyyy' }}</td>
                <td>
                  <span class="badge" 
                        [class.bg-warning]="leave.status === 'pending'"
                        [class.bg-success]="leave.status === 'approved'"
                        [class.bg-danger]="leave.status === 'rejected'">
                    {{ leave.status | uppercase }}
                  </span>
                </td>
                <td *ngIf="isAdmin && leave.status === 'pending'">
                  <button class="btn btn-sm btn-success me-1" 
                          (click)="update.emit({leaveId: leave._id, status: 'approved'})">
                    <i class="bi bi-check-lg"></i> Approve
                  </button>
                  <button class="btn btn-sm btn-danger" 
                          (click)="update.emit({leaveId: leave._id, status: 'rejected'})">
                    <i class="bi bi-x-lg"></i> Reject
                  </button>
                </td>
              </tr>
              <tr *ngIf="leaves.length === 0">
                <td colspan="6" class="text-center text-muted py-4">
                  <i class="bi bi-inbox fs-1"></i>
                  <p class="mt-2">No leave applications found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class LeavesComponent {
  @Input() leaves: any[] = [];
  @Input() isAdmin = false;
  @Output() update = new EventEmitter<{ leaveId: string; status: string }>();

  getStudentName(leave: any): string {
    return typeof leave.studentId === 'object' ? leave.studentId.name : 'Student';
  }

  getStudentReg(leave: any): string {
    return typeof leave.studentId === 'object' ? leave.studentId.regNo : '';
  }
}