import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { LoggerService, LogLevel } from './services/logger.service';

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

  constructor(
    public authService: AuthService,
    private router: Router,
    private logger: LoggerService
  ) {
    this.setWelcomeMessage();
    this.logger.setLevel(LogLevel.Info); // Set the desired log level
  }

  logout() {
    this.authService.logout();
    this.setWelcomeMessage();
    this.router.navigate(['/']);
    this.logger.info('User logged out and redirected to home page');
  }

  private setWelcomeMessage() {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();
      this.logger.debug('User role from AuthService:', role);
      this.welcomeMessage = `Welcome ${role}!`;
    } else {
      this.welcomeMessage = '';
    }
    this.logger.debug('Welcome message set to:', this.welcomeMessage);
  }
}
