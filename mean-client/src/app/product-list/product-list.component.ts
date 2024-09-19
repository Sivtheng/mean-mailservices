import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { OrderConfirmationComponent } from '../components/order-confirmation.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, OrderConfirmationComponent],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  userRole: string = '';
  errorMessage: string = '';
  showOrderConfirmation: boolean = false;
  selectedProductId: string = '';
  showSuccessMessage: boolean = false;
  successMessage: string = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadProducts();
  }

  loadProducts() {
    this.errorMessage = '';
    if (this.userRole === 'seller') {
      this.productService.getMyProducts().subscribe({
        next: (data) => {
          this.products = data;
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.errorMessage = 'Unable to load products. Please try logging in again.';
        }
      });
    } else {
      this.productService.getProducts().subscribe({
        next: (data) => {
          this.products = data;
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.errorMessage = 'Unable to load products. Please try logging in again.';
        }
      });
    }
  }

  initiateOrder(productId: string) {
    this.selectedProductId = productId;
    this.showOrderConfirmation = true;
  }

  confirmOrder(productId: string) {
    this.orderService.placeOrder(productId).subscribe({
      next: (response) => {
        console.log('Order placed successfully', response);
        this.showSuccessMessage = true;
        this.successMessage = 'Order placed successfully!';
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
        this.showOrderConfirmation = false;
      },
      error: (error) => {
        console.error('Error placing order:', error);
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.graphQLErrors) {
          console.error('GraphQL Errors:', error.graphQLErrors);
        }
        if (error.networkError) {
          console.error('Network Error:', error.networkError);
        }
        if (error.message.includes('Authentication token is required')) {
          this.showErrorMessage('You need to be logged in to place an order. Please log in and try again.');
        } else {
          this.showErrorMessage('Error placing order: ' + error.message);
        }
      }
    });
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  cancelOrder() {
    this.showOrderConfirmation = false;
  }

  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId).subscribe({
      next: (response) => {
        console.log('Product deleted successfully', response);
        // Force page reload after successful deletion
        this.router.navigateByUrl('/products', { skipLocationChange: true }).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        // You might want to show an error message to the user
        alert('Error deleting product: ' + error.message);
      }
    });
  }
}