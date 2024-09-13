import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apollo: Apollo) {}

  getProducts(): Observable<any[]> {
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
      `
    })
    .valueChanges.pipe(map(result => result.data.getProducts));
  }

  getMyProducts(): Observable<any[]> {
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
      `
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
      }
    });
  }

  deleteProduct(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation DeleteProduct($id: ID!) {
          deleteProduct(id: $id)
        }
      `,
      variables: {
        id
      }
    });
  }
}