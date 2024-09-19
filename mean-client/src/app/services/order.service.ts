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
            productName
            productPrice
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
            productName
            productPrice
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

  placeOrder(productId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.apollo.mutate({
      mutation: gql`
        mutation PlaceOrder($productId: ID!) {
          placeOrder(productId: $productId) {
            id
            productId
            productName
            productPrice
            status
          }
        }
      `,
      variables: {
        productId
      },
      context: {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      },
      refetchQueries: [
        {
          query: gql`
            query GetMyOrders {
              getMyOrders {
                id
                productId
                productName
                productPrice
                status
              }
            }
          `
        }
      ]
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

  confirmOrder(orderId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ConfirmOrder($orderId: ID!) {
          confirmOrder(orderId: $orderId) {
            id
            status
          }
        }
      `,
      variables: {
        orderId
      }
    });
  }

  rejectOrder(orderId: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation RejectOrder($orderId: ID!) {
          rejectOrder(orderId: $orderId) {
            id
            status
          }
        }
      `,
      variables: {
        orderId
      }
    });
  }
}