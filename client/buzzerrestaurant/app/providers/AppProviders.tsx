'use client';

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { ProfileProvider } from '../context/ProfileContext';
import { RestaurantProvider } from '../context/RestaurantContext';
import { CategoryProvider } from '../context/CategoryContext';
import { ProductProvider } from '../context/ProductContext';
import { CartProvider } from '../context/CartContext';
import { OrderProvider } from '../context/OrderContext';
import { IntlProvider } from './IntlProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider>
        <AuthProvider>
          <ProfileProvider>
            <RestaurantProvider>
              <CategoryProvider>
                <ProductProvider>
                  <OrderProvider>
                    <CartProvider>
                      {children}
                    </CartProvider>
                  </OrderProvider>
                </ProductProvider>
              </CategoryProvider>
            </RestaurantProvider>
          </ProfileProvider>
        </AuthProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
};

