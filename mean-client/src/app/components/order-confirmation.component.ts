import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Order Confirmation</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to place this order?
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              (click)="confirmOrder()"
              class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Yes
            </button>
            <button
              (click)="cancelOrder()"
              class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 ml-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrderConfirmationComponent {
  @Input() productId!: string;
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  confirmOrder() {
    this.confirm.emit(this.productId);
  }

  cancelOrder() {
    this.cancel.emit();
  }
}