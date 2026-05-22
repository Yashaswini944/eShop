import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product, CartItem } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row" *ngIf="product; else loading">
        <div class="col-md-6">
          <img [src]="product.image" class="img-fluid" [alt]="product.name">
        </div>
        <div class="col-md-6">
          <h2>{{ product.name }}</h2>
          <p class="text-muted">{{ product.category }}</p>
          
          <h4 class="text-primary mt-3">\${{ product.price | number:'1.2-2' }}</h4>
          
          <div class="mt-3">
            <span class="badge bg-success" *ngIf="product.stock > 0">In Stock ({{ product.stock }})</span>
            <span class="badge bg-danger" *ngIf="product.stock === 0">Out of Stock</span>
          </div>

          <p class="mt-4">{{ product.description }}</p>

          <div class="mt-5">
            <div class="input-group mb-3" style="width: 150px;">
              <button class="btn btn-outline-secondary" type="button" (click)="decrementQuantity()" [disabled]="quantity <= 1">-</button>
              <input type="text" class="form-control text-center" [value]="quantity" readonly>
              <button class="btn btn-outline-secondary" type="button" (click)="incrementQuantity()" [disabled]="quantity >= product.stock">+</button>
            </div>
          </div>

          <button class="btn btn-primary btn-lg w-100 mt-3" 
            (click)="addToCart()" 
            [disabled]="product.stock === 0">
            Add to Cart
          </button>

          <button class="btn btn-secondary btn-lg w-100 mt-2" routerLink="/products">
            Back to Products
          </button>
        </div>
      </div>

      <ng-template #loading>
        <div class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    img {
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe(product => {
        this.product = product || null;
      });
    }
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      const cartItem: CartItem = {
        productId: this.product.id,
        productName: this.product.name,
        price: this.product.price,
        quantity: this.quantity,
        image: this.product.image
      };
      this.cartService.addToCart(cartItem);
      alert('Product added to cart!');
      this.router.navigate(['/cart']);
    }
  }
}