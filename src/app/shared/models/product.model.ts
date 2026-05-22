export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  total?: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}