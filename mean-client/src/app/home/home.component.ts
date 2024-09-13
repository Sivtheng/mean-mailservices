import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">Welcome to our E-commerce App</h1>
      <div class="flex space-x-4">
        <a routerLink="/login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </a>
        <a routerLink="/register" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Register
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent { }