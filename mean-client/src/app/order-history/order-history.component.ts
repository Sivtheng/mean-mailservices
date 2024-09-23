import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html'
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  userRole: string = '';
  errorMessage: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadOrders();
  }

  loadOrders() {
    this.errorMessage = ''; // Clear any previous error messages
    if (this.userRole === 'buyer') {
      this.orderService.getMyOrders().subscribe({
        next: (data) => {
          this.orders = data;
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
          this.errorMessage = 'Unable to load orders. Please try logging in again.';
        }
      });
    } else if (this.userRole === 'seller') {
      this.orderService.getOrdersBySeller().subscribe({
        next: (data) => {
          this.orders = data;
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
          this.errorMessage = 'Unable to load orders. Please try logging in again.';
        }
      });
    }
  }

  updateOrderStatus(orderId: string, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (response) => {
        console.log('Order status updated successfully', response);
        this.loadOrders(); // Reload the order list
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      }
    });
  }

  confirmOrder(orderId: string) {
    if (confirm('Are you sure you want to confirm this order?')) {
      this.orderService.updateOrderStatus(orderId, 'completed').subscribe({
        next: (response) => {
          console.log('Order confirmed successfully', response);
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error confirming order:', error);
          this.errorMessage = 'Unable to confirm order. Please try again.';
        }
      });
    }
  }

  rejectOrder(orderId: string) {
    if (confirm('Are you sure you want to reject this order?')) {
      this.orderService.updateOrderStatus(orderId, 'cancelled').subscribe({
        next: (response) => {
          console.log('Order rejected successfully', response);
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error rejecting order:', error);
          this.errorMessage = 'Unable to reject order. Please try again.';
        }
      });
    }
  }
}