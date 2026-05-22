import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../shared/models/order.model';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <h2 class="mb-4">My Orders</h2>

      <div class="row" *ngIf="orders.length > 0; else noOrders">
        <div class="col-12">
          <div class="table-responsive">
            <table class="table table-hover table-striped">
              <thead class="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Order Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of orders">
                  <td><strong>{{ order.id }}</strong></td>
                  <td>{{ order.orderDate | date:'short' }}</td>
                  <td>\${{ order.totalAmount | number:'1.2-2' }}</td>
                  <td>
                    <span [ngClass]="getStatusClass(order.orderStatus)">
                      {{ order.orderStatus }}
                    </span>
                  </td>
                  <td>{{ order.items.length }} item(s)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ng-template #noOrders>
        <div class="alert alert-info text-center py-5">
          <h4>No orders yet</h4>
          <p>You haven't placed any orders. Start shopping!</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .status-pending {
      background-color: #ffc107;
      color: black;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .status-processing {
      background-color: #17a2b8;
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .status-completed {
      background-color: #28a745;
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .status-cancelled {
      background-color: #dc3545;
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
  `]
})
export class UserOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.orderService.getMyOrders(currentUser.id).subscribe(orders => {
        this.orders = orders;
      });
    }
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}