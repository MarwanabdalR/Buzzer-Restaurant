import { Order } from '../types/order';

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'min' : 'mins'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
}

export function getRestaurantInfo(order: Order): {
  name: string;
  type: string;
  imageUrl: string | null;
} {
  const firstProduct = order.items[0]?.product;
  if (firstProduct?.restaurant) {
    return {
      name: firstProduct.restaurant.name,
      type: firstProduct.restaurant.type || 'Restaurant',
      imageUrl: firstProduct.restaurant.imageUrl,
    };
  }
  return {
    name: firstProduct?.name ? firstProduct.name.split(' ')[0] : 'Restaurant',
    type: 'Restaurant',
    imageUrl: firstProduct?.image || null,
  };
}

