import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { EmailService } from '../../../services/email.service';
import { Order, OrderStatus } from '../../../shared/models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid mt-5">
      <div class="row mb-4">
        <div class="col-12">
          <h2>Order Management</h2>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <h5>Total Orders</h5>
              <h2 class="text-primary">{{ orders.length }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <h5>Pending</h5>
              <h2 class="text-warning">{{ getPendingCount() }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <h5>Processing</h5>
              <h2 class="text-info">{{ getProcessingCount() }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <h5>Completed</h5>
              <h2 class="text-success">{{ getCompletedCount() }}</h2>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">All Orders</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover table-striped">
              <thead class="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Total Amount</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of orders">
                  <td><strong>{{ order.id }}</strong></td>
                  <td>{{ order.customerName }}</td>
                  <td>{{ order.email }}</td>
                  <td>\${{ order.totalAmount | number:'1.2-2' }}</td>
                  <td>{{ order.orderDate | date:'short' }}</td>
                  <td>
                    <span [ngClass]="getStatusClass(order.orderStatus)">
                      {{ order.orderStatus }}
                    </span>
                  </td>
                  <td>
                    <select class="form-select form-select-sm" 
                      [value]="order.orderStatus"
                      (change)="updateOrderStatus(order, $event)"
                      *ngIf="order.orderStatus !== 'Completed'">
                      <option value="">Change Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button class="btn btn-sm btn-info" 
                      (click)="sendInvoice(order)"
                      *ngIf="order.orderStatus === 'Completed'">
                      Send Invoice
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  getPendingCount(): number {
    return this.orders.filter(o => o.orderStatus === 'Pending').length;
  }

  getProcessingCount(): number {
    return this.orders.filter(o => o.orderStatus === 'Processing').length;
  }

  getCompletedCount(): number {
    return this.orders.filter(o => o.orderStatus === 'Completed').length;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  updateOrderStatus(order: Order, event: any): void {
    const newStatus = event.target.value as OrderStatus;
    if (newStatus) {
      this.orderService.updateOrderStatus(order.id, newStatus).subscribe(
        updatedOrder => {
          if (updatedOrder) {
            alert(`Order status updated to ${newStatus}`);
            this.loadOrders();
            
            if (updatedOrder) {
              this.emailService.sendOrderStatusUpdate(updatedOrder).subscribe(
                () => console.log('Status update email sent'),
                error => console.error('Error sending email:', error)
              );
            }
          }
        },
        error => {
          alert('Error updating order status');
          console.error(error);
        }
      );
    }
  }

  sendInvoice(order: Order): void {
    this.emailService.sendInvoice(order).subscribe(
      () => {
        alert('Invoice sent to ' + order.email);
      },
      error => {
        alert('Error sending invoice');
        console.error(error);
      }
    );
  }
}