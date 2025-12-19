'use client';

import React, { useMemo } from 'react';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { Container } from '../../components/layout/Container';
import { ProductGrid } from '../../components/shop/ProductGrid';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types/product';

export default function FeaturedProductsPage() {
  const { data: allProducts = [], isLoading } = useProducts();

  const featuredProducts = useMemo(() => {
    return allProducts
      .filter((product: Product) => product.isFeatured === true)
      .sort((a: Product, b: Product) => {
        const rateA = a.rate || 0;
        const rateB = b.rate || 0;
        return rateB - rateA;
      });
  }, [allProducts]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <MobileHeader title="Featured Products" showBackButton onMenuClick={() => {}} />
        <div className="flex-1 flex items-center justify-center pb-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="Featured Products" showBackButton onMenuClick={() => {}} />
      
      <main className="flex-1 pb-20 overflow-y-auto">
        <Container>
          <div className="py-4">
            <ProductGrid
              products={featuredProducts}
              emptyMessage="No featured products available"
            />
          </div>
        </Container>
      </main>
    </div>
  );
}

