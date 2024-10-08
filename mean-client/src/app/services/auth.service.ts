import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import gql from 'graphql-tag';
import { jwtDecode } from 'jwt-decode';
import { LoggerService } from './logger.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionTimer: any;
  private readonly SESSION_DURATION = 3600000; // 1 hour in milliseconds

  constructor(private apollo: Apollo, private logger: LoggerService, private router: Router) {}

  login(email: string, password: string): Observable<{ success: boolean; message: string; token: string | null }> {
    return this.apollo.mutate({
      mutation: gql`
        mutation LoginUser($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            success
            message
            token
          }
        }
      `,
      variables: {
        email,
        password
      }
    }).pipe(
      map((result: any) => result.data.loginUser),
      tap((response) => {
        if (response.success) {
          localStorage.setItem('token', response.token!);
          this.startSessionTimer();
        }
      })
    );
  }

  register(name: string, email: string, password: string, role: string): Observable<{ success: boolean; message: string; user: any | null }> {
    return this.apollo.mutate({
      mutation: gql`
        mutation RegisterUser($name: String!, $email: String!, $password: String!, $role: String!) {
          registerUser(name: $name, email: $email, password: $password, role: $role) {
            success
            message
            user {
              id
              name
              email
              role
            }
          }
        }
      `,
      variables: {
        name,
        email,
        password,
        role
      }
    }).pipe(map((result: any) => result.data.registerUser));
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      const isLoggedIn = !!localStorage.getItem('token');
      this.logger.debug('isLoggedIn:', isLoggedIn);
      return isLoggedIn;
    }
    return false;
  }

  getUserRole(): string {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          this.logger.debug('Decoded token:', decodedToken);
          if (decodedToken && typeof decodedToken === 'object') {
            this.logger.debug('User role from token:', decodedToken.role);
            return decodedToken.role || '';
          }
        } catch (error) {
          this.logger.error('Error decoding token:', error);
        }
      }
    }
    this.logger.debug('No token found or unable to decode');
    return '';
  }

  startSessionTimer() {
    this.clearSessionTimer();
    this.sessionTimer = setTimeout(() => {
      this.logout();
      this.router.navigate(['/login']);
    }, this.SESSION_DURATION);
  }

  clearSessionTimer() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
  }

  refreshSession() {
    this.startSessionTimer();
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      this.apollo.client.resetStore();
      this.clearSessionTimer();
      this.logger.info('User logged out');
    }
  }

  forgotPassword(email: string): Observable<{ success: boolean; message: string }> {
    console.log('AuthService.forgotPassword called with email:', email);
    return this.apollo.mutate({
      mutation: gql`
        mutation ForgotPassword($email: String!) {
          forgotPassword(email: $email) {
            success
            message
          }
        }
      `,
      variables: {
        email
      }
    }).pipe(
      map((result: any) => {
        console.log('GraphQL forgotPassword response:', result);
        return result.data.forgotPassword;
      })
    );
  }

  resetPassword(resetToken: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ResetPassword($resetToken: String!, $newPassword: String!) {
          resetPassword(resetToken: $resetToken, newPassword: $newPassword) {
            success
            message
          }
        }
      `,
      variables: {
        resetToken,
        newPassword
      }
    }).pipe(
      map((result: any) => result.data.resetPassword)
    );
  }

  isVerified(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          return decodedToken.isVerified || false;
        } catch (error) {
          this.logger.error('Error decoding token:', error);
        }
      }
    }
    return false;
  }

  async verifyEmail(userId: string): Promise<Observable<{ success: boolean; message: string; }>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation VerifyEmail($userId: String!) {
          verifyEmail(userId: $userId) {
            success
            message
          }
        }
      `,
      variables: {
        userId
      }
    }).pipe(
      map((result: any) => result.data.verifyEmail),
      catchError((error) => {
        console.error('GraphQL error:', error);
        return of({ success: false, message: error.message });
      })
    );
  }

  updateEmailPreferences(newsletterOptIn: boolean, allEmailsOptIn: boolean): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateEmailPreferences($newsletterOptIn: Boolean!, $allEmailsOptIn: Boolean!) {
          updateEmailPreferences(newsletterOptIn: $newsletterOptIn, allEmailsOptIn: $allEmailsOptIn) {
            userId
            newsletterOptIn
            allEmailsOptIn
          }
        }
      `,
      variables: {
        newsletterOptIn,
        allEmailsOptIn
      },
      context: {
        headers: this.getHeaders()
      }
    });
  }

  getCurrentUser(): Observable<any> {
    return this.apollo.query({
      query: gql`
        query GetCurrentUser {
          getCurrentUser {
            id
            name
            email
            newsletterOptIn
            allEmailsOptIn
          }
        }
      `,
      context: {
        headers: this.getHeaders()
      }
    }).pipe(
      map((result: any) => result.data.getCurrentUser)
    );
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}