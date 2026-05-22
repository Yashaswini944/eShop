import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem } from '../../shared/models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5 mb-5">
      <h2 class="mb-4">Shopping Cart</h2>

      <div class="row" *ngIf="(cartItems$ | async) as items; else noCart">
        <div class="col-md-8">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-dark">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of items">
                  <td>
                    <div class="d-flex align-items-center">
                      <img [src]="item.image" [alt]="item.productName" 
                        style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                      <span>{{ item.productName }}</span>
                    </div>
                  </td>
                  <td>\${{ item.price | number:'1.2-2' }}</td>
                  <td>
                    <div class="input-group" style="width: 100px;">
                      <button class="btn btn-sm btn-outline-secondary" 
                        (click)="decrementQuantity(item.productId)" 
                        [disabled]="item.quantity <= 1">-</button>
                      <input type="text" class="form-control text-center form-control-sm" 
                        [value]="item.quantity" readonly>
                      <button class="btn btn-sm btn-outline-secondary" 
                        (click)="incrementQuantity(item.productId)">+</button>
                    </div>
                  </td>
                  <td>
                    <strong>\${{ (item.total || 0) | number:'1.2-2' }}</strong>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-danger" 
                      (click)="removeItem(item.productId)">
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Order Summary</h5>
              <hr>
              <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>\${{ totalPrice | number:'1.2-2' }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Tax (10%):</span>
                <span>\${{ (totalPrice * 0.1) | number:'1.2-2' }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>\$10.00</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between mb-3">
                <h5>Total:</h5>
                <h5>\${{ (totalPrice * 1.1 + 10) | number:'1.2-2' }}</h5>
              </div>
              <button class="btn btn-success btn-lg w-100 mb-2" routerLink="/checkout">
                Proceed to Checkout
              </button>
              <button class="btn btn-secondary w-100" routerLink="/products">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noCart>
        <div class="alert alert-info text-center py-5">
          <h4>Your cart is empty</h4>
          <p>Start shopping to add items to your cart.</p>
          <button class="btn btn-primary" routerLink="/products">Continue Shopping</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    img {
      border-radius: 4px;
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  totalPrice: number = 0;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.getCartItems();
  }

  ngOnInit(): void {
    this.cartItems$.subscribe(() => {
      this.totalPrice = this.cartService.getCartTotalPrice();
    });
  }

  incrementQuantity(productId: string): void {
    const item = this.cartService.getCart().items.find(i => i.productId === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrementQuantity(productId: string): void {
    const item = this.cartService.getCart().items.find(i => i.productId === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }
}