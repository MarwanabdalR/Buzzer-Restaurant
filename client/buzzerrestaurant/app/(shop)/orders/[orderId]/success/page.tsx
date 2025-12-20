'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { MapPinIcon } from '@heroicons/react/24/solid';
import { MobileHeader } from '../../../../components/layout/MobileHeader';
import { Container } from '../../../../components/layout/Container';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { ImageWithLoader } from '../../../../components/ui/ImageWithLoader';
import { useOrders } from '../../../../context/OrderContext';
import { Order } from '../../../../types/order';
import { getRestaurantInfo } from '../../../../lib/orderUtils';

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.orderId);
  const { getOrderById } = useOrders();

  const { data: order, isLoading } = useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="md:hidden">
          <MobileHeader title="Order Status" showBackButton onMenuClick={() => {}} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="md:hidden">
          <MobileHeader title="Order Status" showBackButton onMenuClick={() => {}} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Order not found</p>
        </div>
      </div>
    );
  }

  const restaurantInfo = getRestaurantInfo(order);
  const featuredProduct = order.items[0]?.product;
  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'READY':
        return 'Ready';
      case 'PENDING':
        return 'Pending';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  };

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
        <MobileHeader title="Order Status" showBackButton onMenuClick={() => {}} />
      </div>

      <main className="flex-1 pb-24 md:pb-0 overflow-y-auto">
        {/* Mobile View */}
        <div className="md:hidden">
          <Container>
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Order #{orderId}
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Your order has been requested. Kindly go to the<br />
                  home to track your order.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/')}
                  className="bg-[#FFB800] text-[#4d0d0d] font-bold py-4 px-8 rounded-lg"
                >
                  BACK TO HOMEPAGE
                </motion.button>
              </motion.div>
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
                  <h1 className="text-4xl font-bold mb-2">Order Status</h1>
                  <p className="text-sm text-gray-300">Home / Basket</p>
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
                    className="bg-white rounded-t-3xl p-6 max-w-md mx-auto shadow-2xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(featuredProduct.rate)}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{featuredProduct.name}</h2>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl font-bold text-gray-900">
                        EGP {parseFloat(order.items[0]?.price || '0').toFixed(2)}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/')}
                      className="w-full border-2 border-[#FFB800] bg-[#FFB800]/10 text-gray-900 font-bold py-4 px-6 rounded-lg text-lg hover:bg-[#FFB800] transition-colors"
                    >
                      Back to Homepage
                    </motion.button>
                  </motion.div>
                </Container>
              </div>
            )}
          </div>

          {/* Blue Divider Line */}
          <div className="h-1 bg-blue-500 w-full" />

          {/* Order Details Card */}
          <div className="bg-white">
            <Container>
              <div className="py-12 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-lg border border-gray-200 p-8 shadow-lg"
                >
                  <div className="flex flex-col items-center mb-8">
                    {/* Buzzer Circle */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5, delay: 0.4 }}
                      className="relative w-32 h-32 mb-6"
                    >
                      <div className="absolute inset-0 bg-red-600/30 rounded-full blur-2xl animate-pulse" />
                      <div className="relative w-full h-full bg-[#4d0d0d] rounded-full flex items-center justify-center shadow-2xl">
                        {/* Glowing dots around perimeter */}
                        <div className="absolute inset-0 rounded-full">
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                            <div
                              key={i}
                              className="absolute w-3 h-3 bg-red-500 rounded-full animate-pulse"
                              style={{
                                top: '50%',
                                left: '50%',
                                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-60px)`,
                                animationDelay: `${i * 0.1}s`,
                              }}
                            />
                          ))}
                        </div>
                        {/* Center "R" logo */}
                        <span className="text-5xl font-bold text-white z-10">R</span>
                      </div>
                    </motion.div>

                    {/* Order Price */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-3xl font-bold text-[#4d0d0d] mb-4"
                    >
                      EGP {parseFloat(order.totalPrice).toFixed(2)}
                    </motion.div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-600 font-medium">Order No: </span>
                      <span className="text-xl font-bold text-gray-900">{order.id}</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{restaurantInfo.name}</h3>
                      <p className="text-gray-600">{restaurantInfo.type}</p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPinIcon className="w-5 h-5 text-[#4d0d0d]" />
                      <span>{order.location || restaurantInfo.name}</span>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <span className="text-gray-600 font-medium">Status: </span>
                      <span className="text-lg font-bold text-gray-900">
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Container>
          </div>
        </div>
      </main>
    </div>
  );
}

