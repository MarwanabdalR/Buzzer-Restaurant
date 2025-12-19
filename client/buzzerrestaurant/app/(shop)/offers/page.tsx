'use client';

import React, { useMemo } from 'react';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { Container } from '../../components/layout/Container';
import { ProductGrid } from '../../components/shop/ProductGrid';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types/product';
import { calculateDiscount } from '../../lib/productUtils';

export default function OffersPage() {
  const { data: allProducts = [], isLoading } = useProducts();

  const productsWithOffers = useMemo(() => {
    return allProducts
      .filter((product: Product) => {
        const discount = calculateDiscount(product.price, product.originalPrice);
        return discount !== null && discount > 0;
      })
      .sort((a: Product, b: Product) => {
        const discountA = calculateDiscount(a.price, a.originalPrice) || 0;
        const discountB = calculateDiscount(b.price, b.originalPrice) || 0;
        return discountB - discountA;
      });
  }, [allProducts]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <MobileHeader title="Offers" showBackButton onMenuClick={() => {}} />
        <div className="flex-1 flex items-center justify-center pb-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="Offers" showBackButton onMenuClick={() => {}} />
      
      <main className="flex-1 pb-20 overflow-y-auto">
        <Container>
          <div className="py-4">
            <ProductGrid
              products={productsWithOffers}
              emptyMessage="No offers available at the moment"
            />
          </div>
        </Container>
      </main>
    </div>
  );
}

