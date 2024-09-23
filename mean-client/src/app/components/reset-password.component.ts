import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class ResetPasswordComponent {
    resetToken: string = '';
    newPassword: string = '';
    confirmPassword: string = '';
    errorMessage: string = '';
    successMessage: string = '';

    constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {
        this.route.params.subscribe(params => {
            this.resetToken = params['token'];
        });
    }

    onSubmit() {
        if (this.newPassword !== this.confirmPassword) {
            this.errorMessage = 'Passwords do not match';
            return;
        }
        this.authService.resetPassword(this.resetToken, this.newPassword).subscribe({
            next: (response) => {
                if (response.success) {
                    this.successMessage = 'Password has been reset successfully';
                    this.errorMessage = '';
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 3000);
                } else {
                    this.errorMessage = response.message;
                    this.successMessage = '';
                }
            },
            error: (error) => {
                this.errorMessage = 'An error occurred. Please try again.';
                this.successMessage = '';
            }
        });
    }
}