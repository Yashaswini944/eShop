import { Routes } from '@angular/router';
import { AdminOrdersComponent } from './orders/admin-orders.component';
import { AdminUsersComponent } from './users/admin-users.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'orders',
    component: AdminOrdersComponent
  },
  {
    path: 'users',
    component: AdminUsersComponent
  }
];