import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent], // Import ToastComponent
  template: `    <app-toast></app-toast>
<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'Student Management System';
}