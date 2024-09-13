import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <nav class="mb-4">
        <ul class="flex space-x-4">
          <li><a routerLink="/" class="text-blue-500 hover:text-blue-700">Home</a></li>
          <ng-container *ngIf="authService.isLoggedIn()">
            <li><a routerLink="/products" class="text-blue-500 hover:text-blue-700">Products</a></li>
            <li><a routerLink="/order-history" class="text-blue-500 hover:text-blue-700">
              {{ authService.getUserRole() === 'seller' ? 'Manage Orders' : 'Order History' }}
            </a></li>
            <li *ngIf="authService.getUserRole() === 'seller'">
              <a routerLink="/create-product" class="text-blue-500 hover:text-blue-700">Add Product</a>
            </li>
          </ng-container>
          <li *ngIf="!authService.isLoggedIn()"><a routerLink="/login" class="text-blue-500 hover:text-blue-700">Login</a></li>
          <li *ngIf="!authService.isLoggedIn()"><a routerLink="/register" class="text-blue-500 hover:text-blue-700">Register</a></li>
          <li *ngIf="authService.isLoggedIn()"><a (click)="logout()" class="text-blue-500 hover:text-blue-700 cursor-pointer">Logout</a></li>
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

  logout() {
    this.authService.logout();
    // Redirect to home page or login page after logout
  }
}
