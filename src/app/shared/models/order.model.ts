export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  address: string;
  totalAmount: number;
  orderDate: Date;
  orderStatus: OrderStatus;
  items: OrderItem[];
}

export interface OrderDetail {
  orderId: string;
  status: OrderStatus;
  statusColor: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';