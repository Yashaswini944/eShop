import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Order } from '../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://api.example.com/api/email';

  constructor(private http: HttpClient) {}

  sendOrderConfirmation(order: Order): Observable<any> {
    const emailData = {
      to: order.email,
      subject: `Order Confirmation - ${order.id}`,
      orderDetails: order
    };

    // Mock implementation
    return of({
      message: 'Order confirmation email sent',
      recipient: order.email,
      timestamp: new Date()
    });
  }

  sendOrderStatusUpdate(order: Order): Observable<any> {
    const emailData = {
      to: order.email,
      subject: `Order Status Update - ${order.id}`,
      status: order.orderStatus,
      orderDetails: order
    };

    return of({
      message: 'Status update email sent',
      recipient: order.email,
      status: order.orderStatus,
      timestamp: new Date()
    });
  }

  sendInvoice(order: Order): Observable<any> {
    const emailData = {
      to: order.email,
      subject: `Invoice - ${order.id}`,
      orderDetails: order,
      attachInvoice: true
    };

    return of({
      message: 'Invoice sent',
      recipient: order.email,
      timestamp: new Date()
    });
  }

  testService(): Observable<any> {
    return of({
      message: 'Email Service is working correctly',
      capabilities: ['sendOrderConfirmation', 'sendOrderStatusUpdate', 'sendInvoice']
    });
  }
}