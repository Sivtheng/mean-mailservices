import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductListComponent],
  template: `
    <router-outlet></router-outlet>
    <app-product-list></app-product-list>
  `
})
export class AppComponent { }
