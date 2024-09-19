import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private apollo: Apollo) {}

  getMyOrders(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.apollo.watchQuery<any>({
      query: gql`
        query GetMyOrders {
          getMyOrders {
            id
            productId
            quantity
            status
          }
        }
      `,
      context: {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      }
    })
    .valueChanges.pipe(map(result => result.data.getMyOrders));
  }

  getOrdersBySeller(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.apollo.watchQuery<any>({
      query: gql`
        query GetOrdersBySeller {
          getOrdersBySeller {
            id
            productId
            quantity
            status
          }
        }
      `,
      context: {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      }
    })
    .valueChanges.pipe(map(result => result.data.getOrdersBySeller));
  }

  placeOrder(productId: string, quantity: number): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation PlaceOrder($productId: ID!, $quantity: Int!) {
          placeOrder(productId: $productId, quantity: $quantity) {
            id
            productId
            quantity
            status
          }
        }
      `,
      variables: {
        productId,
        quantity
      }
    });
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
          updateOrderStatus(orderId: $orderId, status: $status) {
            id
            status
          }
        }
      `,
      variables: {
        orderId,
        status
      }
    });
  }
}