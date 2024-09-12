import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
}