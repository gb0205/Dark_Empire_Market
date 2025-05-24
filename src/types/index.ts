
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  dataAiHint?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  isAdmin?: boolean;
  joinDate?: string; // ISO string
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number; // Price at the time of purchase
}

export interface Order {
  id: string;
  userId: string;
  date: string; // ISO string
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}
