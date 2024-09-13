import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  role: string = 'buyer'; // Default role
  errorMessage: string = '';
  
  // Add this property to define the available roles
  roles: string[] = ['buyer', 'seller'];

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.name, this.email, this.password, this.role).subscribe(
      (response) => {
        if (response.success) {
          console.log('User registered:', response.user);
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = response.message;
        }
      },
      (error) => {
        console.error('Registration error:', error);
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
    );
  }
}