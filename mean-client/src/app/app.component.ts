import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth/auth.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <nav class="mb-4">
        <ul class="flex space-x-4">
          <li><a routerLink="/" class="text-blue-500 hover:text-blue-700">Home</a></li>
          <li *ngIf="authService.isLoggedIn()"><a routerLink="/products" class="text-blue-500 hover:text-blue-700">Products</a></li>
          <li *ngIf="authService.isLoggedIn()"><a routerLink="/order-history" class="text-blue-500 hover:text-blue-700">Order History</a></li>
          <li *ngIf="authService.isLoggedIn()"><a routerLink="/email-preferences" class="text-blue-500 hover:text-blue-700">Email Preferences</a></li>
          <li *ngIf="!authService.isLoggedIn()"><a routerLink="/login" class="text-blue-500 hover:text-blue-700">Login</a></li>
          <li *ngIf="!authService.isLoggedIn()"><a routerLink="/register" class="text-blue-500 hover:text-blue-700">Register</a></li>
        </ul>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      @apply bg-gray-100 min-h-screen;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
