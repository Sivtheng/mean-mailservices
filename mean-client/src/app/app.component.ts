import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

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
      <div *ngIf="authService.isLoggedIn()" class="mb-4 text-lg font-bold">
        Welcome {{ authService.getUserRole() === 'seller' ? 'Seller' : 'Buyer' }}!
      </div>
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
  welcomeMessage: string = '';

  constructor(public authService: AuthService, private router: Router) {
    this.setWelcomeMessage();
  }

  logout() {
    this.authService.logout();
    this.setWelcomeMessage();
    this.router.navigate(['/']); // Navigate to home page after logout
  }

  private setWelcomeMessage() {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();
      console.log('User role from AuthService:', role);
      this.welcomeMessage = `Welcome ${role}!`;
    } else {
      this.welcomeMessage = '';
    }
    console.log('Welcome message set to:', this.welcomeMessage);
  }
}
