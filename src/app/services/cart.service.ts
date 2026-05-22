import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem, Cart } from '../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>(this.getCartFromStorage());
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.updateCartSubject();
  }

  private getCartFromStorage(): CartItem[] {
    if (typeof localStorage !== 'undefined') {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    }
    return [];
  }

  private saveCartToStorage(items: CartItem[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
    this.cartSubject.next(items);
    this.updateCartSubject();
  }

  private updateCartSubject(): void {
    const items = this.getCartFromStorage();
    this.cartSubject.next(items);
  }

  addToCart(item: CartItem): void {
    const items = this.getCartFromStorage();
    const existingItem = items.find(i => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      item.total = item.quantity * item.price;
      items.push(item);
    }

    this.saveCartToStorage(items);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cart$;
  }

  getCartItemCount(): number {
    return this.getCartFromStorage().reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartTotalPrice(): number {
    return this.getCartFromStorage().reduce((sum, item) => sum + (item.total || 0), 0);
  }

  updateQuantity(productId: string, quantity: number): void {
    const items = this.getCartFromStorage();
    const item = items.find(i => i.productId === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        item.total = quantity * item.price;
        this.saveCartToStorage(items);
      }
    }
  }

  removeFromCart(productId: string): void {
    const items = this.getCartFromStorage().filter(i => i.productId !== productId);
    this.saveCartToStorage(items);
  }

  clearCart(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('cart');
    }
    this.saveCartToStorage([]);
  }

  getCart(): Cart {
    const items = this.getCartFromStorage();
    return {
      items,
      totalPrice: this.getCartTotalPrice(),
      totalItems: this.getCartItemCount()
    };
  }

  testService(): Observable<any> {
    return of({
      message: 'Cart Service is working correctly',
      cartItems: this.getCartFromStorage().length,
      cartTotal: this.getCartTotalPrice(),
      cart: this.getCart()
    });
  }
}