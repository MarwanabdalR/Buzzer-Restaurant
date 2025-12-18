export interface Category {
  id: number;
  name: string;
  image: string | null;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category | Category[];
}

