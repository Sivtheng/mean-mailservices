import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-preferences.component.html'
})
export class EmailPreferencesComponent implements OnInit {
  newsletterOptIn: boolean = true;
  allEmailsOptIn: boolean = true;
  isLoggedIn: boolean = false;
  

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.loadCurrentPreferences();
    }
  }

  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('token');
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  loadCurrentPreferences() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.newsletterOptIn = user.newsletterOptIn;
          this.allEmailsOptIn = user.allEmailsOptIn;
        }
      },
      error: (error) => {
        console.error('Error loading user preferences:', error);
        if (error.message.includes('Authentication token is required')) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onSubmit() {
    if (!this.isLoggedIn) {
      alert('Please log in to update your preferences.');
      this.router.navigate(['/login']);
      return;
    }

    this.authService.updateEmailPreferences(this.newsletterOptIn, this.allEmailsOptIn).subscribe({
      next: (response) => {
        console.log('Email preferences updated', response);
        alert('Email preferences updated successfully!');
      },
      error: (error) => {
        console.error('Error updating email preferences', error);
        if (error.message.includes('Authentication token is required')) {
          alert('Your session has expired. Please log in again.');
          this.router.navigate(['/login']);
        } else {
          alert(`Error updating email preferences: ${error.message}`);
        }
      }
    });
  }
}