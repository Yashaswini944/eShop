import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../models/auth.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/">
          <strong>eShop</strong>
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                Home
              </a>
            </li>
            
            <li class="nav-item">
              <a class="nav-link" routerLink="/products" routerLinkActive="active">
                Products
              </a>
            </li>

            <li class="nav-item" *ngIf="isAuthenticated$ | async">
              <a class="nav-link" routerLink="/user/orders" routerLinkActive="active">
                My Orders
              </a>
            </li>

            <li class="nav-item" *ngIf="(isAdmin$ | async)">
              <a class="nav-link" routerLink="/admin/orders" routerLinkActive="active">
                Admin
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" routerLink="/cart" routerLinkActive="active">
                Cart
                <span class="badge bg-primary ms-1" *ngIf="cartCount > 0">{{ cartCount }}</span>
              </a>
            </li>

            <li class="nav-item dropdown" *ngIf="currentUser$ | async as user">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                {{ user.name }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" (click)="logout()">Logout</a></li>
              </ul>
            </li>

            <li class="nav-item" *ngIf="!(isAuthenticated$ | async)">
              <a class="nav-link" routerLink="/account/login" routerLinkActive="active">
                Login
              </a>
            </li>

            <li class="nav-item" *ngIf="!(isAuthenticated$ | async)">
              <a class="nav-link" routerLink="/account/register" routerLinkActive="active">
                Register
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-size: 1.5rem;
    }
    .badge {
      position: relative;
      top: -2px;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  currentUser$: Observable<AuthUser | null>;
  cartCount: number = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isAdmin$ = this.authService.isAdmin$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getCartItemCount();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}