import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Product } from '../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.example.com/api/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 79.99,
      image: 'https://via.placeholder.com/300x200?text=Headphones',
      category: 'Electronics',
      stock: 50,
      rating: 4.5
    },
    {
      id: '2',
      name: 'USB-C Cable',
      description: 'Durable USB-C cable for fast charging',
      price: 12.99,
      image: 'https://via.placeholder.com/300x200?text=USB+Cable',
      category: 'Accessories',
      stock: 100,
      rating: 4.2
    },
    {
      id: '3',
      name: 'Phone Case',
      description: 'Protective phone case with premium design',
      price: 24.99,
      image: 'https://via.placeholder.com/300x200?text=Phone+Case',
      category: 'Accessories',
      stock: 75,
      rating: 4.7
    },
    {
      id: '4',
      name: 'Screen Protector',
      description: 'Tempered glass screen protector',
      price: 9.99,
      image: 'https://via.placeholder.com/300x200?text=Screen+Protector',
      category: 'Accessories',
      stock: 200,
      rating: 4.3
    },
    {
      id: '5',
      name: 'Portable Charger',
      description: '20000mAh portable power bank',
      price: 34.99,
      image: 'https://via.placeholder.com/300x200?text=Portable+Charger',
      category: 'Electronics',
      stock: 40,
      rating: 4.6
    },
    {
      id: '6',
      name: 'Bluetooth Speaker',
      description: 'Portable Bluetooth speaker with excellent sound quality',
      price: 49.99,
      image: 'https://via.placeholder.com/300x200?text=Bluetooth+Speaker',
      category: 'Electronics',
      stock: 30,
      rating: 4.4
    }
  ];

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsSubject.next(this.mockProducts);
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: string): Observable<Product | undefined> {
    return of(this.mockProducts.find(p => p.id === id));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return of(this.mockProducts.filter(p => p.category === category));
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const filtered = this.mockProducts.filter(p =>
      p.name.toLowerCase().includes(keyword.toLowerCase()) ||
      p.description.toLowerCase().includes(keyword.toLowerCase())
    );
    return of(filtered);
  }

  testService(): Observable<any> {
    return of({
      message: 'Product Service is working correctly',
      timestamp: new Date(),
      mockProductsCount: this.mockProducts.length,
      products: this.mockProducts
    });
  }
}