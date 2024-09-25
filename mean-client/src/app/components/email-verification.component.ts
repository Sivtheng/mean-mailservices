import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-email-verification',
    template: `<h1>{{ message }}</h1>`,
})
export class EmailVerificationComponent implements OnInit {
    message: string = '';

    constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

    async ngOnInit() {
        const token = this.route.snapshot.paramMap.get('token');
        if (token) {
            try {
                const decoded = jwtDecode(token) as { userId: string };
                (await this.authService.verifyEmail(decoded.userId)).subscribe({
                    next: (response) => {
                        if (response.success) {
                            this.message = 'Email verified successfully! You can now log in.';
                            setTimeout(() => this.router.navigate(['/login']), 3000);
                        } else {
                            this.message = 'Verification failed: ' + response.message;
                        }
                    },
                    error: (err) => {
                        console.error('Verification error:', err);
                        this.message = 'Verification failed: An unexpected error occurred.';
                    },
                });
            } catch (error) {
                console.error('Token decoding error:', error);
                this.message = 'Invalid verification token.';
            }
        } else {
            this.message = 'No verification token provided.';
        }
    }
}