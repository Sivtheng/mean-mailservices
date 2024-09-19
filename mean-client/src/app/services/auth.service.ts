import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { jwtDecode } from 'jwt-decode';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo, private logger: LoggerService) {}

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
    }).pipe(map((result: any) => result.data.loginUser));
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

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      this.apollo.client.resetStore();
      this.logger.info('User logged out');
    }
  }
}