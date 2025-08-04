import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');

  constructor(private auth: AuthService) {}

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }
}
