export interface Restaurant {
  id: string;
  name: string;
  type: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  rating: number;
  imageUrl: string | null;
  createdAt: string;
  distance?: number | null; // Distance in km for nearby restaurants
}

