import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductListComponent } from './product-list/product-list.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { EmailPreferencesComponent } from './email-preferences/email-preferences.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'email-preferences', component: EmailPreferencesComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
];