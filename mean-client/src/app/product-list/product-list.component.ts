import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  userRole: string = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadProducts();
  }

  loadProducts() {
    if (this.userRole === 'seller') {
      this.productService.getMyProducts().subscribe(
        (data) => {
          this.products = data;
        },
        (error) => {
          console.error('Error fetching products:', error);
        }
      );
    } else {
      this.productService.getProducts().subscribe(
        (data) => {
          this.products = data;
        },
        (error) => {
          console.error('Error fetching products:', error);
        }
      );
    }
  }

  placeOrder(productId: string) {
    this.orderService.placeOrder(productId, 1).subscribe(
      (response) => {
        console.log('Order placed successfully', response);
        // You might want to show a success message to the user
      },
      (error) => {
        console.error('Error placing order:', error);
        // You might want to show an error message to the user
      }
    );
  }

  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId).subscribe(
      (response) => {
        console.log('Product deleted successfully', response);
        this.loadProducts(); // Reload the product list
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }
}