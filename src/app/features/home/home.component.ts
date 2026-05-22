import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <div class="hero-section bg-primary text-white py-5">
      <div class="container text-center">
        <h1 class="display-4 mb-4">Welcome to eShop</h1>
        <p class="lead mb-4">Your trusted online marketplace for quality products</p>
        <button routerLink="/products" class="btn btn-light btn-lg">
          Start Shopping
        </button>
      </div>
    </div>

    <!-- Features Section -->
    <div class="container my-5">
      <div class="row g-4">
        <div class="col-md-4">
          <div class="text-center">
            <div class="mb-3">
              <i class="bi bi-truck" style="font-size: 3rem; color: #007bff;"></i>
            </div>
            <h5>Free Shipping</h5>
            <p class="text-muted">On orders over $50</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="text-center">
            <div class="mb-3">
              <i class="bi bi-shield-check" style="font-size: 3rem; color: #28a745;"></i>
            </div>
            <h5>Secure Payment</h5>
            <p class="text-muted">100% secure transactions</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="text-center">
            <div class="mb-3">
              <i class="bi bi-arrow-counterclockwise" style="font-size: 3rem; color: #ffc107;"></i>
            </div>
            <h5>Easy Returns</h5>
            <p class="text-muted">30-day money back guarantee</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Products Section -->
    <div class="container my-5">
      <h2 class="mb-4 text-center">Featured Products</h2>
      <div class="row g-4">
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body">
              <h5 class="card-title">Electronics</h5>
              <p class="card-text">Discover our latest electronics collection with best prices</p>
              <button routerLink="/products" class="btn btn-primary">Shop Now</button>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body">
              <h5 class="card-title">Accessories</h5>
              <p class="card-text">Premium accessories to complement your lifestyle</p>
              <button routerLink="/products" class="btn btn-primary">Shop Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-light py-5">
      <div class="container text-center">
        <h2 class="mb-3">Special Offer!</h2>
        <p class="lead mb-4">Get 20% off on your first purchase with code WELCOME20</p>
        <button routerLink="/products" class="btn btn-primary btn-lg">
          Shop Now
        </button>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 400px;
      display: flex;
      align-items: center;
    }
    .card {
      transition: transform 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class HomeComponent {}