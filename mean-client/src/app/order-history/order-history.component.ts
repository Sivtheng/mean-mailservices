import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: any[] = [];

  ngOnInit() {
    // Fetch orders from API
    this.orders = [
      { id: 1, productName: 'Product 1', quantity: 2, total: 20 },
      { id: 2, productName: 'Product 2', quantity: 1, total: 20 },
      { id: 3, productName: 'Product 3', quantity: 3, total: 90 },
    ];
  }
}