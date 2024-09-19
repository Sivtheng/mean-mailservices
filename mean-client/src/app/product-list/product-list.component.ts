import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router'; // Add Router import

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  userRole: string = '';
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router // Add Router to the constructor
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

  placeOrder(productId: string) {
    this.orderService.placeOrder(productId, 1).subscribe({
      next: (response) => {
        console.log('Order placed successfully', response);
        // You might want to show a success message to the user
      },
      error: (error) => {
        console.error('Error placing order:', error);
        // You might want to show an error message to the user
      }
    });
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