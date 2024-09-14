import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html'
})
export class AddProductComponent {
  product = {
    name: '',
    description: '',
    price: 0
  };

  constructor(private productService: ProductService, private router: Router) {}

  onSubmit() {
    console.log('Submitting product:', this.product);
    this.productService.createProduct(this.product.name, this.product.description, this.product.price).subscribe({
      next: (response) => {
        console.log('Product added successfully', response);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error adding product:', error);
        // Display error message to user
        alert('Error adding product: ' + error.message);
      }
    });
  }
}