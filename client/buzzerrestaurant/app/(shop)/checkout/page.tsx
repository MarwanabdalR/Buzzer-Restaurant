'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ImageWithLoader } from '../../components/ui/ImageWithLoader';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { Container } from '../../components/layout/Container';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { StarRating } from '../../components/ui/StarRating';
import api from '../../lib/axios';
import { getIdToken } from '../../lib/firebase';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { refreshOrders } = useOrders();
  const [deliveryLocation, setDeliveryLocation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('Checkout');
  const tCommon = useTranslations('Common');
  const tSuccess = useTranslations('Success');

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const restaurant = items[0]?.product.restaurant;
  const subtotal = getTotalPrice();
  const vat = subtotal * 0.15; // 15% VAT
  const total = subtotal + vat;
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

  const handlePlaceOrder = async () => {
    if (!deliveryLocation.trim()) {
      toast.error(t('deliveryLocationRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) {
        toast.error('Please login to place an order');
        router.push('/login');
        return;
      }

      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        location: deliveryLocation.trim(),
      };

      const response = await api.post('/orders', orderData, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      clearCart();
      await refreshOrders();
      toast.success('Order placed successfully!');
      router.push(`/orders/${response.data.data.id}/success`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
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
            {/* Delivery Location Section */}
            <div className="bg-white rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t('deliveryLocation')}</h2>
              <textarea
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder={t('deliveryLocationPlaceholder')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] outline-none resize-none text-gray-900 placeholder-gray-400"
                required
                aria-required="true"
              />
            </div>

            {restaurant && (
              <div className="bg-white rounded-xl p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t('pickupLocation')}</h2>
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    {restaurant.imageUrl ? (
                      <ImageWithLoader
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        fill
                        className=""
                        sizes="64px"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <StarRating rating={restaurant.rating} size="sm" showNumber />
                    <h3 className="font-bold text-gray-900 mt-1">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600">{restaurant.type}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{restaurant.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t('paymentMethod')}</h2>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{t('cashOnDelivery')}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t('orderedItems')}</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                      {item.product.image ? (
                        <ImageWithLoader
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className=""
                          sizes="64px"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1">
                      <StarRating rating={item.product.rate} size="sm" showNumber />
                      <h3 className="font-bold text-gray-900 mt-1">{item.product.name}</h3>
                      <div className="space-y-1 mt-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{tCommon('price')}:</span>
                          <span className="font-semibold">EGP {parseFloat(item.product.price).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">{tCommon('quantity')}:</span>
                          <span className="font-semibold">x{item.quantity}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                                    <span>{tCommon('subtotal')}:</span>
                          <span>EGP {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t('orderSummary')}</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>{tCommon('subtotal')}:</span>
                  <span className="font-semibold">EGP {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{tCommon('vat')}:</span>
                  <span className="font-semibold">EGP {vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
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
            <div className="absolute top-8 right-0 z-10 pr-12">
              <div className="text-white text-right">
                <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
                <p className="text-sm text-gray-300">{tCommon('home')} / {tCommon('basket')}</p>
              </div>
            </div>

            {/* Featured Product Card Overlay */}
            {featuredProduct && (
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <Container>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-t-3xl p-6 max-w-md mx-auto shadow-2xl"
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
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="w-full border-2 border-[#FFB800] bg-[#FFB800]/10 text-gray-900 font-bold py-4 px-6 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFB800] transition-colors"
                    >
                      {isSubmitting ? t('placingOrder') : t('placeOrder')}
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
                  {/* Left Section */}
                  <div className="flex-1 space-y-8">
                    {/* Delivery Location Section */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-[#4d0d0d]">{t('deliveryLocation')}</h3>
                      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <label className="block mb-2 text-gray-700 font-medium">
                          {t('enterDeliveryLocation')}
                        </label>
                        <textarea
                          value={deliveryLocation}
                          onChange={(e) => setDeliveryLocation(e.target.value)}
                          placeholder={t('deliveryLocationPlaceholder')}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] outline-none resize-none text-gray-900 placeholder-gray-400 text-base"
                          required
                          aria-required="true"
                        />
                      </div>
                    </div>

                    {/* Pickup Location Section */}
                    {restaurant && (
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-[#4d0d0d]">{t('pickupLocation')}</h3>
                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                          <div className="flex items-start gap-4">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0">
                              {restaurant.imageUrl ? (
                                <ImageWithLoader
                                  src={restaurant.imageUrl}
                                  alt={restaurant.name}
                                  fill
                                  className="object-cover"
                                  sizes="96px"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-1 mb-2">
                                {renderStars(restaurant.rating)}
                              </div>
                              <h4 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h4>
                              <p className="text-gray-600 mb-2">{restaurant.type}</p>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPinIcon className="w-5 h-5 text-[#4d0d0d]" />
                                <span>{restaurant.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Method Section */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-[#4d0d0d]">{t('paymentMethod')}</h3>
                      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900 text-lg">{t('cashOnDelivery')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items Section */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-[#4d0d0d]">{t('orderedItems')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {items.map((item, index) => (
                          <motion.div
                            key={item.product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                          >
                            <div className="flex items-start gap-4">
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
                              <div className="flex-1">
                                <div className="flex items-center gap-1 mb-2">
                                  {renderStars(item.product.rate)}
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1">{item.product.name}</h4>
                                <button
                                  onClick={() => router.push(`/products/${item.product.id}`)}
                                  className="text-[#FFB800] text-sm font-medium hover:underline mb-3"
                                >
                                  {tCommon('viewDetails')}
                                </button>
                                <div className="space-y-1 pt-3 border-t border-gray-200">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{tCommon('price')}:</span>
                                    <span className="font-semibold text-gray-900">EGP {parseFloat(item.product.price).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">{tCommon('quantity')}:</span>
                                    <span className="font-semibold text-gray-900">x {item.quantity}</span>
                                  </div>
                                  <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-900">Subtotal:</span>
                                    <span className="text-gray-900">EGP {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
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
                            <span className="text-lg font-bold text-gray-900">Total:</span>
                            <span className="text-lg font-bold text-[#4d0d0d]">EGP {total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>

          {/* Bottom Place Order Button */}
          <div className="bg-white border-t border-gray-200 py-6">
            <Container>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="border-2 border-[#FFB800] bg-[#FFB800]/10 text-gray-900 font-bold py-4 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFB800] transition-colors"
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </motion.button>
              </div>
            </Container>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        <Container>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full bg-[#FFB800] text-[#4d0d0d] font-bold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('placingOrder') : t('placeOrder')}
          </motion.button>
        </Container>
      </div>
    </div>
  );
}

