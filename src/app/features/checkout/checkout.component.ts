import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';
import { OrderItem } from '../../shared/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-5 mb-5">
      <div class="row">
        <div class="col-md-8">
          <h2 class="mb-4">Checkout</h2>

          <form [formGroup]="checkoutForm" (ngSubmit)="submitOrder()">
            <!-- Billing Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5>Billing Information</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Full Name *</label>
                    <input type="text" class="form-control" formControlName="name"
                      [class.is-invalid]="isFieldInvalid('name')">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('name')">
                      Full name is required.
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-control" formControlName="email"
                      [class.is-invalid]="isFieldInvalid('email')">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
                      Valid email is required.
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Address *</label>
                  <input type="text" class="form-control" formControlName="address"
                    [class.is-invalid]="isFieldInvalid('address')">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('address')">
                    Address is required.
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5>Payment Information</h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label class="form-label">Card Number *</label>
                  <input type="text" class="form-control" formControlName="cardNumber" 
                    placeholder="1234 5678 9012 3456"
                    [class.is-invalid]="isFieldInvalid('cardNumber')">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('cardNumber')">
                    Valid card number is required.
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Expiry Date *</label>
                    <input type="text" class="form-control" formControlName="cardExpiry" 
                      placeholder="MM/YY"
                      [class.is-invalid]="isFieldInvalid('cardExpiry')">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('cardExpiry')">
                      Expiry date is required.
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">CVC *</label>
                    <input type="text" class="form-control" formControlName="cardCVC" 
                      placeholder="123"
                      [class.is-invalid]="isFieldInvalid('cardCVC')">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('cardCVC')">
                      CVC is required.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-success btn-lg w-100" 
              [disabled]="!checkoutForm.valid || isProcessing">
              {{ isProcessing ? 'Processing...' : 'Place Order' }}
            </button>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="col-md-4">
          <div class="card sticky-top" style="top: 20px;">
            <div class="card-body">
              <h5 class="card-title">Order Summary</h5>
              <hr>
              
              <div class="mb-3" *ngIf="cartItems.length > 0">
                <div *ngFor="let item of cartItems" class="d-flex justify-content-between mb-2">
                  <div>
                    <p class="mb-0">{{ item.productName }}</p>
                    <small class="text-muted">Qty: {{ item.quantity }}</small>
                  </div>
                  <span>\${{ (item.total || 0) | number:'1.2-2' }}</span>
                </div>
              </div>

              <hr>
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>\${{ subtotal | number:'1.2-2' }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Tax (10%):</span>
                <span>\${{ (subtotal * 0.1) | number:'1.2-2' }}</span>
              </div>
              <div class="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>\$10.00</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <h5>Total:</h5>
                <h5>\${{ total | number:'1.2-2' }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .is-invalid {
      border-color: #dc3545 !important;
    }
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875em;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: any[] = [];
  subtotal: number = 0;
  total: number = 0;
  isProcessing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private emailService: EmailService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  private initForm(): void {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/)]],
      cardExpiry: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cardCVC: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  private loadCartItems(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }

  private calculateTotals(): void {
    this.subtotal = this.cartService.getCartTotalPrice();
    this.total = this.subtotal * 1.1 + 10;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  submitOrder(): void {
    if (!this.checkoutForm.valid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    this.isProcessing = true;
    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      alert('Please login before placing an order.');
      this.isProcessing = false;
      return;
    }

    const orderItems: OrderItem[] = this.cartItems.map(item => ({
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity
    }));

    const newOrder = {
      id: '',
      customerId: currentUser.id,
      customerName: this.checkoutForm.get('name')?.value,
      email: this.checkoutForm.get('email')?.value,
      address: this.checkoutForm.get('address')?.value,
      totalAmount: this.total,
      orderDate: new Date(),
      orderStatus: 'Pending' as any,
      items: orderItems
    };

    this.orderService.createOrder(newOrder).subscribe(
      order => {
        this.emailService.sendOrderConfirmation(order).subscribe(
          () => console.log('Confirmation email sent'),
          error => console.error('Error sending email:', error)
        );

        this.cartService.clearCart();
        alert('Order placed successfully! Order ID: ' + order.id);
        this.isProcessing = false;
        this.router.navigate(['/user/orders']);
      },
      error => {
        alert('Error placing order. Please try again.');
        this.isProcessing = false;
      }
    );
  }
}