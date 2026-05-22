import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../../../shared/models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <h2 class="mb-4">Our Products</h2>
      
      <div class="row">
        <div class="col-md-3">
          <div class="card">
            <h5 class="card-header">Filter</h5>
            <div class="card-body">
              <input type="text" class="form-control" placeholder="Search products..." 
                (keyup)="onSearch($event)">
            </div>
          </div>
        </div>

        <div class="col-md-9">
          <div class="row" *ngIf="(products$ | async) as products; else loading">
            <div class="col-md-4 mb-4" *ngFor="let product of products">
              <div class="card h-100 shadow-sm hover-card">
                <img [src]="product.image" class="card-img-top" [alt]="product.name" 
                  style="height: 200px; object-fit: cover;">
                <div class="card-body">
                  <h5 class="card-title">{{ product.name }}</h5>
                  <p class="card-text text-muted">{{ product.description }}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mb-0 text-primary">\${{ product.price | number:'1.2-2' }}</h4>
                    <span class="badge bg-success">Stock: {{ product.stock }}</span>
                  </div>
                  <div class="mt-3">
                    <a [routerLink]="['/products', product.id]" class="btn btn-sm btn-primary w-100">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ng-template #loading>
            <div class="col-12 text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </ng-template>

          <div class="col-12 text-center mt-4" *ngIf="(filteredProducts$ | async) as products; else noProducts">
            <p *ngIf="products.length === 0">No products found.</p>
          </div>

          <ng-template #noProducts>
            <div class="col-12 text-center mt-4">
              <p>No products match your search.</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hover-card {
      transition: transform 0.3s ease;
    }
    .hover-card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  filteredProducts$: Observable<Product[]>;
  private searchTerm: string = '';

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getProducts();
    this.filteredProducts$ = this.products$;
  }

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    if (this.searchTerm.trim()) {
      this.filteredProducts$ = this.productService.searchProducts(this.searchTerm);
    } else {
      this.filteredProducts$ = this.products$;
    }
  }
}