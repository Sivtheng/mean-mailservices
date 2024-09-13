import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.setItem('token', response.token!);
          this.router.navigate(['/products']);
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
}