import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.authService.startSessionTimer();
          if (this.authService.isVerified()) {
            this.router.navigate(['/products']);
          } else {
            this.successMessage = 'Login successful, but your account is not verified. Please verify your email.';
          }
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
    });
  }

  forgotPassword() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    console.log('LoginComponent.forgotPassword called with email:', this.email);

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        console.log('ForgotPassword response:', response);
        if (response.success) {
          this.successMessage = response.message;
          this.errorMessage = '';
        } else {
          this.errorMessage = response.message;
          this.successMessage = '';
        }
      },
      error: (error) => {
        console.error('Forgot password error:', error);
        this.errorMessage = 'An error occurred. Please try again.';
        this.successMessage = '';
      }
    });
  }
}