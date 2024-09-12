import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  login(email: string, password: string): Observable<string> {
    return this.apollo.mutate({
      mutation: gql`
        mutation LoginUser($email: String!, $password: String!) {
          loginUser(email: $email, password: $password)
        }
      `,
      variables: {
        email,
        password
      }
    }).pipe(map((result: any) => result.data.loginUser));
  }

  register(name: string, email: string, password: string, role: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation RegisterUser($name: String!, $email: String!, $password: String!, $role: String!) {
          registerUser(name: $name, email: $email, password: $password, role: $role) {
            id
            name
            email
            role
          }
        }
      `,
      variables: {
        name,
        email,
        password,
        role
      }
    });
  }
}