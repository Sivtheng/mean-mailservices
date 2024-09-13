import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {}

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
      console.log('isLoggedIn:', isLoggedIn);
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
          console.log('Decoded token:', decodedToken);
          if (decodedToken && typeof decodedToken === 'object') {
            console.log('User role from token:', decodedToken.role);
            return decodedToken.role || '';
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }
    console.log('No token found or unable to decode');
    return '';
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.clear(); // This will remove all items from local storage
      // If you want to remove only specific items, you can use:
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      this.apollo.client.resetStore();
    }
  }
}