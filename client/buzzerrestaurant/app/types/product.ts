export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  productId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    fullName: string;
    image: string | null;
  };
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  originalPrice?: string | null;
  discountPercent?: number | null;
  image: string | null;
  images?: string[];
  rate: number | null;
  isFeatured?: boolean;
  categoryId: number;
  restaurantId?: string | null;
  category?: {
    id: number;
    name: string;
  };
  restaurant?: {
    id: string;
    name: string;
    type: string;
    location: string;
    rating: number;
    imageUrl: string | null;
  };
  reviews?: Review[];
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product | Product[];
}

