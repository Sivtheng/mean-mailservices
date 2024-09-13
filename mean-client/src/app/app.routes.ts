import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductListComponent } from './product-list/product-list.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { EmailPreferencesComponent } from './email-preferences/email-preferences.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: 'email-preferences', component: EmailPreferencesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];