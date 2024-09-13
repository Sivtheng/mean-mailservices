import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];
  userRole: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadOrders();
  }

  loadOrders() {
    if (this.userRole === 'buyer') {
      this.orderService.getMyOrders().subscribe({
        next: (data) => {
          this.orders = data;
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
        }
      });
    } else if (this.userRole === 'seller') {
      this.orderService.getOrdersBySeller().subscribe({
        next: (data) => {
          this.orders = data;
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
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
}