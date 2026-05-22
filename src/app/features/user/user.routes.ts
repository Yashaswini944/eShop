import { Routes } from '@angular/router';
import { UserOrdersComponent } from './orders/user-orders.component';
import { AuthenticationGuard } from '../../core/guards/authentication.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    canActivateChild: [AuthenticationGuard],
    children: [
      {
        path: 'orders',
        component: UserOrdersComponent
      }
    ]
  }
];
