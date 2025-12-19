'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MobileHeader } from '../../../../components/layout/MobileHeader';
import { Container } from '../../../../components/layout/Container';
import { ProductGrid } from '../../../../components/shop/ProductGrid';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { useRestaurant } from '../../../../hooks/useRestaurant';
import { useRestaurantProducts } from '../../../../hooks/useRestaurantProducts';

export default function SupplierProductsPage() {
  const params = useParams();
  const restaurantId = params.restaurantId as string;

  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(restaurantId);
  const { data: products = [], isLoading: productsLoading } = useRestaurantProducts(restaurantId);

  if (restaurantLoading || productsLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <MobileHeader title="Supplier Products" showBackButton onMenuClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="Supplier Products" showBackButton onMenuClick={() => {}} />
      
      <main className="flex-1 pb-20 overflow-y-auto">
        <Container>
          <div className="py-4">
            <ProductGrid
              products={products}
              restaurant={restaurant || undefined}
              emptyMessage="No products available for this supplier"
            />
          </div>
        </Container>
      </main>
    </div>
  );
}

