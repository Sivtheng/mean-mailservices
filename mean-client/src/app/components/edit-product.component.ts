import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Edit Product</h2>
      <form (ngSubmit)="onSubmit()" #productForm="ngForm">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Product Name:</label>
          <input type="text" id="name" name="name" [(ngModel)]="product.name" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="mb-4">
          <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea id="description" name="description" [(ngModel)]="product.description" required
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div class="mb-4">
          <label for="price" class="block text-gray-700 text-sm font-bold mb-2">Price:</label>
          <input type="number" id="price" name="price" [(ngModel)]="product.price" required
                 class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <button type="submit" [disabled]="!productForm.form.valid"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Update Product
        </button>
      </form>
    </div>
  `
})
export class EditProductComponent implements OnInit {
  product: any = {
    id: '',
    name: '',
    description: '',
    price: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProducts().subscribe(products => {
        const foundProduct = products.find((p: any) => p.id === productId);
        if (foundProduct) {
          this.product = { ...foundProduct };
        }
      });
    }
  }

  onSubmit() {
    this.productService.updateProduct(
      this.product.id,
      this.product.name,
      this.product.description,
      this.product.price
    ).subscribe({
      next: (response) => {
        console.log('Product updated successfully', response);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error updating product:', error);
        // Handle error (e.g., show error message to user)
      }
    });
  }
}