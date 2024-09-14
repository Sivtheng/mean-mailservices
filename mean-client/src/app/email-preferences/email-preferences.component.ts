import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './email-preferences.component.html'
})
export class EmailPreferencesComponent {
  newsletterOptIn: boolean = true;
  allEmailsOptIn: boolean = true;

  onSubmit() {
    // Implement email preference update logic here
    console.log('Email preferences updated', this.newsletterOptIn, this.allEmailsOptIn);
  }
}