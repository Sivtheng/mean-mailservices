import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apollo: Apollo) {}

  getProducts(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.apollo.watchQuery<any>({
      query: gql`
        query GetProducts {
          getProducts {
            id
            name
            description
            price
          }
        }
      `,
      context: {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      }
    })
    .valueChanges.pipe(map(result => result.data.getProducts));
  }

  getMyProducts(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.apollo.watchQuery<any>({
      query: gql`
        query GetMyProducts {
          getMyProducts {
            id
            name
            description
            price
          }
        }
      `,
      context: {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      }
    })
    .valueChanges.pipe(map(result => result.data.getMyProducts));
  }

  createProduct(name: string, description: string, price: number): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation CreateProduct($name: String!, $description: String!, $price: Float!) {
          createProduct(name: $name, description: $description, price: $price) {
            id
            name
            description
            price
          }
        }
      `,
      variables: {
        name,
        description,
        price
      },
      context: {
        headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      }
    });
  }

  deleteProduct(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.apollo.mutate({
      mutation: gql`
        mutation DeleteProduct($id: ID!) {
          deleteProduct(id: $id)
        }
      `,
      variables: {
        id
      },
      context: {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      }
    });
  }

  updateProduct(id: string, name: string, description: string, price: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateProduct($id: ID!, $name: String!, $description: String!, $price: Float!) {
          updateProduct(id: $id, name: $name, description: $description, price: $price) {
            id
            name
            description
            price
          }
        }
      `,
      variables: {
        id,
        name,
        description,
        price
      },
      context: {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      }
    });
  }
}