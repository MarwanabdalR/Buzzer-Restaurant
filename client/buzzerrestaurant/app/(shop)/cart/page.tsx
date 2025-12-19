'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { ImageWithLoader } from '../../components/ui/ImageWithLoader';
import { TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { Container } from '../../components/layout/Container';
import { useCart } from '../../context/CartContext';
import { StarRating } from '../../components/ui/StarRating';
import { calculateDiscount } from '../../lib/productUtils';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const t = useTranslations('Cart');
  const tCommon = useTranslations('Common');

  const handleViewDetails = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleClearCart = () => {
    if (showConfirmClear) {
      clearCart();
      setShowConfirmClear(false);
    } else {
      setShowConfirmClear(true);
      // Auto-hide confirmation after 3 seconds if not clicked again
      setTimeout(() => {
        setShowConfirmClear(false);
      }, 3000);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="md:hidden">
          <MobileHeader title={t('title')} showBackButton onMenuClick={() => {}} />
        </div>

        {/* Desktop Empty State */}
        <div className="hidden md:block relative w-full h-[400px] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
          <div className="absolute top-8 left-0 right-0 z-10">
            <Container>
              <div className="text-white text-center">
                <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
                <p className="text-sm text-gray-300">{tCommon('home')} / {t('title')}</p>
              </div>
            </Container>
          </div>
        </div>

        {/* Empty Cart Content */}
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-500 mb-4 text-lg">{t('emptyCart')}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="bg-[#4d0d0d] text-white px-8 py-3 rounded-lg font-semibold"
            >
              {tCommon('continueShopping')}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  const restaurant = items[0]?.product.restaurant;
  const total = getTotalPrice();
  const subtotal = getTotalPrice();
  const vat = subtotal * 0.15; // 15% VAT
  const finalTotal = subtotal + vat;
  const featuredProduct = items[0]?.product || null;

  const renderStars = (rating: number | null) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} className="w-5 h-5 text-[#FFB800] fill-[#FFB800]" />);
    }
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="w-5 h-5 text-[#FFB800] fill-[#FFB800] opacity-50" />);
    }
    const emptyStars = 5 - Math.ceil(rating || 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header - hidden on desktop */}
      <div className="md:hidden">
        <MobileHeader title={t('title')} showBackButton onMenuClick={() => {}} />
      </div>
      
      <main className="flex-1 pb-24 md:pb-0 overflow-y-auto">
        {/* Mobile View */}
        <div className="md:hidden">
          <Container>
            <div className="py-4 space-y-4">
            {restaurant && (
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h2>
                    <p className="text-[#4d0d0d] font-medium">{restaurant.type}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearCart}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      showConfirmClear
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    {showConfirmClear ? t('confirmClear') : t('emptyCartConfirm')}
                  </motion.button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                      {item.product.image ? (
                        <ImageWithLoader
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className=""
                          sizes="80px"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <StarRating rating={item.product.rate} size="sm" showNumber />
                          <h3 className="font-bold text-gray-900 mt-1">{item.product.name}</h3>
                          <button
                            onClick={() => handleViewDetails(item.product.id)}
                            className="text-[#FFB800] text-sm font-medium mt-1"
                          >
                            {tCommon('viewDetails')}
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{tCommon('price')}:</span>
                          <span className="font-semibold text-gray-900">EGP {parseFloat(item.product.price).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{tCommon('quantity')}:</span>
                          <span className="font-semibold text-gray-900">x {item.quantity}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-gray-900">{tCommon('subtotal')}:</span>
                          <span className="text-gray-900">EGP {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t('orderSummary')}</h2>
              <div className="space-y-2">
                <div className="flex justify-between pt-2">
                  <span className="text-lg font-bold text-gray-900">{tCommon('total')}:</span>
                  <span className="text-lg font-bold text-[#4d0d0d]">EGP {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          {/* Hero Header with Background */}
          <div className="relative w-full h-[400px] overflow-hidden">
            {featuredProduct?.image ? (
              <>
                <ImageWithLoader
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
            )}
            
            {/* Breadcrumb */}
            <div className="absolute top-8 left-0 right-0 z-10">
              <Container>
              <div className="text-white text-center">
                <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
                <p className="text-sm text-gray-300">{tCommon('home')} / {t('title')}</p>
              </div>
              </Container>
            </div>

            {/* Featured Product Card Overlay */}
            {featuredProduct && (
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <Container>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-t-3xl p-6 max-w-md mx-auto ml-auto mr-8 shadow-2xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(featuredProduct.rate)}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{featuredProduct.name}</h2>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl font-bold text-gray-900">
                        EGP {featuredProduct.price}
                      </span>
                      {featuredProduct.originalPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          EGP {featuredProduct.originalPrice}
                        </span>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      className="w-full bg-[#FFB800] text-gray-900 font-bold py-4 px-6 rounded-lg text-lg"
                    >
                      {t('proceedToCheckout')}
                    </motion.button>
                  </motion.div>
                </Container>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="bg-white">
            <Container>
              <div className="py-12 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left Section - Items Grid */}
                  <div className="flex-1">
                    {restaurant && (
                      <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {featuredProduct?.name || 'Items'}
                        </h2>
                        <button
                          onClick={() => router.push(`/supplier/${restaurant.id}/products`)}
                          className="text-[#4d0d0d] text-lg font-medium hover:underline"
                        >
                          {tCommon('restaurant')}
                        </button>
                      </div>
                    )}

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            {/* Circular Image */}
                            <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
                              {item.product.image ? (
                                <ImageWithLoader
                                  src={item.product.image}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200" />
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-1 mb-2">
                                    {renderStars(item.product.rate)}
                                  </div>
                                  <h3 className="font-bold text-gray-900 mb-1">{item.product.name}</h3>
                                  <button
                                    onClick={() => handleViewDetails(item.product.id)}
                                    className="text-[#FFB800] text-sm font-medium hover:underline"
                                  >
                                    {tCommon('viewDetails')}
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600 transition-colors shrink-0"
                                  aria-label="Remove item"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Price, Quantity, Subtotal */}
                              <div className="space-y-1 mt-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">{tCommon('price')}:</span>
                                  <span className="font-semibold text-gray-900">EGP {parseFloat(item.product.price).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">{tCommon('quantity')}:</span>
                                  <span className="font-semibold text-gray-900">x {item.quantity}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold">
                                  <span className="text-gray-900">{tCommon('subtotal')}:</span>
                                  <span className="text-gray-900">EGP {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right Section - Order Summary */}
                  <div className="lg:w-80 shrink-0">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm sticky top-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">{t('orderSummary')}</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between text-gray-700">
                          <span>{tCommon('subtotal')}:</span>
                          <span className="font-semibold">EGP {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>{tCommon('vat')}:</span>
                          <span className="font-semibold">EGP {vat.toFixed(2)}</span>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900">{tCommon('total')}:</span>
                            <span className="text-lg font-bold text-[#4d0d0d]">EGP {finalTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Cart Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        <Container>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            className="w-full bg-[#FFB800] text-[#4d0d0d] font-bold py-4 px-6 rounded-lg"
          >
            {t('proceedToCheckout')}
          </motion.button>
        </Container>
      </div>
    </div>
  );
}

