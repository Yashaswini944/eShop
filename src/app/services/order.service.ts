import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Order, OrderStatus } from '../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://api.example.com/api/orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  private mockOrders: Order[] = [
    {
      id: 'ORD001',
      customerId: 'CUST001',
      customerName: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St, City, State 12345',
      totalAmount: 129.97,
      orderDate: new Date('2024-01-15'),
      orderStatus: 'Completed',
      items: [
        { productId: '1', productName: 'Wireless Headphones', price: 79.99, quantity: 1 },
        { productId: '2', productName: 'USB-C Cable', price: 12.99, quantity: 4 }
      ]
    },
    {
      id: 'ORD002',
      customerId: 'CUST002',
      customerName: 'Jane Smith',
      email: 'jane@example.com',
      address: '456 Oak Ave, Town, State 67890',
      totalAmount: 74.97,
      orderDate: new Date('2024-01-18'),
      orderStatus: 'Processing',
      items: [
        { productId: '3', productName: 'Phone Case', price: 24.99, quantity: 3 }
      ]
    },
    {
      id: 'ORD003',
      customerId: 'CUST001',
      customerName: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St, City, State 12345',
      totalAmount: 49.98,
      orderDate: new Date('2024-01-20'),
      orderStatus: 'Pending',
      items: [
        { productId: '4', productName: 'Screen Protector', price: 9.99, quantity: 5 }
      ]
    }
  ];

  constructor(private http: HttpClient) {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersSubject.next(this.mockOrders);
  }

  getAllOrders(): Observable<Order[]> {
    return this.orders$;
  }

  getMyOrders(customerId: string): Observable<Order[]> {
    return of(this.mockOrders.filter(o => o.customerId === customerId));
  }

  getOrderById(orderId: string): Observable<Order | undefined> {
    return of(this.mockOrders.find(o => o.id === orderId));
  }

  createOrder(order: Order): Observable<Order> {
    const newOrder = {
      ...order,
      id: 'ORD' + Date.now()
    };
    this.mockOrders.push(newOrder);
    this.ordersSubject.next(this.mockOrders);
    return of(newOrder);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Observable<Order | undefined> {
    const order = this.mockOrders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      this.ordersSubject.next([...this.mockOrders]);
    }
    return of(order);
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return of(this.mockOrders.filter(o => o.orderStatus === status));
  }

  testService(): Observable<any> {
    return of({
      message: 'Order Service is working correctly',
      totalOrders: this.mockOrders.length,
      ordersData: this.mockOrders
    });
  }
}