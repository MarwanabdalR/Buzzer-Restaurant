export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  image: string | null;
  rate: number | null;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product | Product[];
}

