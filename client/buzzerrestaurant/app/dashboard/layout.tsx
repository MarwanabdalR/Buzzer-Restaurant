'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { AdminModalProvider, useAdminModal } from '../context/AdminModalContext';
import { Bars3Icon, HomeIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Modal } from '../components/admin/Modal';
import { RestaurantForm } from '../components/admin/RestaurantForm';
import { CategoryForm } from '../components/admin/CategoryForm';
import { ProductForm } from '../components/admin/ProductForm';
import { useRestaurants } from '../context/RestaurantContext';
import { useCategory } from '../context/CategoryContext';
import { useProduct } from '../context/ProductContext';
import toast from 'react-hot-toast';

function AdminModalManager() {
  const { modalState, closeModal } = useAdminModal();
  const { createRestaurant, updateRestaurant } = useRestaurants();
  const { createCategory, updateCategory } = useCategory();
  const { createProduct, updateProduct } = useProduct();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRestaurantSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (modalState.action === 'create') {
        await createRestaurant(data);
      } else if (modalState.action === 'edit' && modalState.data) {
        await updateRestaurant((modalState.data as any).id, data);
      }
      closeModal();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (modalState.action === 'create') {
        await createCategory({ name: data.name, image: data.imageUrl || null });
      } else if (modalState.action === 'edit' && modalState.data) {
        await updateCategory((modalState.data as any).id, {
          name: data.name,
          image: data.imageUrl || null,
        });
      }
      closeModal();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const productData = {
        name: data.name,
        description: data.description || null,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        image: data.imageUrl || null,
        rate: data.rate || null,
        isFeatured: data.isFeatured || false,
        categoryId: data.categoryId,
        restaurantId: data.restaurantId || null,
      };

      if (modalState.action === 'create') {
        await createProduct(productData);
      } else if (modalState.action === 'edit' && modalState.data) {
        await updateProduct((modalState.data as any).id, productData);
      }
      closeModal();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    if (modalState.type === 'restaurant') {
      return modalState.action === 'create' ? 'Create Restaurant' : 'Edit Restaurant';
    }
    if (modalState.type === 'category') {
      return modalState.action === 'create' ? 'Create Category' : 'Edit Category';
    }
    if (modalState.type === 'product') {
      return modalState.action === 'create' ? 'Create Product' : 'Edit Product';
    }
    return '';
  };

  const getInitialData = () => {
    if (!modalState.data) return undefined;

    if (modalState.type === 'restaurant') {
      const data = modalState.data as any;
      return {
        name: data.name,
        type: data.type,
        location: data.location,
        rating: data.rating,
        imageUrl: data.imageUrl,
      };
    }

    if (modalState.type === 'category') {
      const data = modalState.data as any;
      return {
        name: data.name,
        image: data.image,
      };
    }

    if (modalState.type === 'product') {
      const data = modalState.data as any;
      return {
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        image: data.image,
        rate: data.rate,
        isFeatured: data.isFeatured,
        categoryId: data.categoryId,
        restaurantId: data.restaurantId,
      };
    }

    return undefined;
  };

  return (
    <Modal isOpen={modalState.isOpen} onClose={closeModal} title={getModalTitle()} size="lg">
      {modalState.type === 'restaurant' && (
        <RestaurantForm
          onSubmit={handleRestaurantSubmit}
          onCancel={closeModal}
          initialData={getInitialData()}
          loading={isSubmitting}
        />
      )}
      {modalState.type === 'category' && (
        <CategoryForm
          onSubmit={handleCategorySubmit}
          onCancel={closeModal}
          initialData={getInitialData()}
          loading={isSubmitting}
        />
      )}
      {modalState.type === 'product' && (
        <ProductForm
          onSubmit={handleProductSubmit}
          onCancel={closeModal}
          initialData={getInitialData()}
          loading={isSubmitting}
        />
      )}
    </Modal>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (profile) {
        if (profile.type !== 'admin') {
          router.push('/');
          return;
        }
      } else if (!profile && user) {
        // Profile not loaded yet but user is authenticated, wait a bit
        setTimeout(() => {
          if (profile && profile.type !== 'admin') {
            router.push('/');
          }
        }, 1000);
      }
    }
  }, [user, profile, authLoading, profileLoading, router]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#4d0d0d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (profile && profile.type !== 'admin')) {
    return null;
  }

  return (
    <AdminModalProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Bars3Icon className="w-6 h-6 text-gray-700" />
                </button>
                <motion.button
                  onClick={() => router.push('/dashboard')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 bg-[#4d0d0d] rounded-lg flex items-center justify-center">
                    <HomeIcon className="w-5 h-5 text-[#FFB800]" />
                  </div>
                  <span className="text-xl font-bold text-[#4d0d0d] group-hover:text-[#FFB800] transition-colors hidden sm:block">
                    Dashboard
                  </span>
                </motion.button>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-semibold text-[#4d0d0d]">{profile?.fullName || 'Admin'}</span>
                </span>
              </div>
            </div>
          </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        </div>

        <AdminModalManager />
      </div>
    </AdminModalProvider>
  );
}

