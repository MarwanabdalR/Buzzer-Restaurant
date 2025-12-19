export interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: {
    id: number;
    name: string;
    image: string | null;
    rate: number | null;
    restaurant?: {
      id: string;
      name: string;
      type: string;
      imageUrl: string | null;
    } | null;
  };
}

export interface Order {
  id: number;
  totalPrice: string;
  status: string;
  createdAt: string;
  location?: string | null;
  items: OrderItem[];
}

export interface OrderResponse {
  success: boolean;
  data: Order | Order[];
  count?: number;
  message?: string;
}

