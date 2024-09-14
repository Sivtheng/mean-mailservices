import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
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
