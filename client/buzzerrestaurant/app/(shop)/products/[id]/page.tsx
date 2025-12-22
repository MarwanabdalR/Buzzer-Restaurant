'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ImageWithLoader } from '../../../components/ui/ImageWithLoader';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { MobileHeader } from '../../../components/layout/MobileHeader';
import { Container } from '../../../components/layout/Container';
import { StarRating } from '../../../components/ui/StarRating';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useCart } from '../../../context/CartContext';
import { AddedToBasketModal } from '../../../components/ui/AddedToBasketModal';
import { ReviewForm } from '../../../components/reviews/ReviewForm';
import { ReviewCard } from '../../../components/reviews/ReviewCard';
import api from '../../../lib/axios';
import { Product, Review } from '../../../types/product';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { useProfile } from '../../../context/ProfileContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const { addToCart, showAddedModal, setShowAddedModal } = useCart();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [refetchReviews, setRefetchReviews] = useState(0);

  const { data: product, isLoading, refetch: refetchProduct } = useQuery<Product>({
    queryKey: ['product', productId, refetchReviews],
    queryFn: async () => {
      const response = await api.get<Product>(`/products/${productId}`);
      return response.data;
    },
    enabled: !!productId,
  });

  // Note: userReview matching depends on backend returning the correct userId in reviews
  // For now, we'll let ReviewForm handle checking for existing reviews
  const userReview = null;


  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <MobileHeader title="Product Detail" showBackButton onMenuClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <MobileHeader title="Product Detail" showBackButton onMenuClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Product not found</p>
        </div>
      </div>
    );
  }

  const discount = product.discountPercent || null;
  const description = product.description || 'No description available.';

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header - hidden on desktop */}
      <div className="md:hidden">
        <MobileHeader title="Product Detail" showBackButton onMenuClick={() => {}} />
      </div>
      
      <main className="flex-1 pb-24 md:pb-0 overflow-y-auto">
        {/* Mobile View */}
        <div className="md:hidden bg-white">
          <div className="relative aspect-[4/3] w-full">
            {product.image ? (
              <>
                <ImageWithLoader
                  src={product.image}
                  alt={product.name}
                  fill
                  className=""
                  sizes="100vw"
                  priority
                  objectFit="cover"
                />
                {discount && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 left-4 bg-[#4d0d0d] text-white px-3 py-1 rounded-lg text-sm font-bold"
                  >
                    {discount}% off
                  </motion.div>
                )}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-[#4d0d0d] rounded-full"></div>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          <Container>
            <div className="py-4 space-y-4">
              <StarRating rating={product.rate} size="md" showNumber />

              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#4d0d0d]">
                  EGP {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    EGP {product.originalPrice}
                  </span>
                )}
              </div>

              {product.restaurant && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Supplier</h2>
                    <button className="text-sm text-[#FFB800] font-medium">
                      Rate Supplier
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      {product.restaurant.imageUrl ? (
                        <ImageWithLoader
                          src={product.restaurant.imageUrl}
                          alt={product.restaurant.name}
                          fill
                          className=""
                          sizes="64px"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="mb-1">
                        <StarRating rating={product.restaurant.rating} size="sm" showNumber />
                      </div>
                      <h3 className="font-bold text-gray-900">{product.restaurant.name}</h3>
                      <p className="text-sm text-gray-600">{product.restaurant.type}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPinIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">{product.restaurant.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h2 className="font-semibold text-gray-900">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {showFullDescription ? description : `${description.substring(0, 150)}...`}
                </p>
                {description.length > 150 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-[#FFB800] text-sm font-medium"
                  >
                    {showFullDescription ? 'See less' : 'See more'}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <h2 className="font-semibold text-gray-900">
                  Customer Reviews ({product.reviews?.length || 0})
                </h2>
                
                {user && (
                  <ReviewForm
                    productId={productId}
                    existingReview={userReview ? { rating: userReview.rating, comment: userReview.comment } : null}
                    onSuccess={() => {
                      setRefetchReviews((prev) => prev + 1);
                      refetchProduct();
                    }}
                  />
                )}

                <div className="space-y-4">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <ReviewCard key={review.id} review={review} index={index} />
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          {/* Hero Header with Blurred Background */}
          <div className="relative w-full h-[600px] overflow-hidden">
            {product.image ? (
              <>
                <ImageWithLoader
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
            )}
            
            {/* Breadcrumb */}
            <div className="absolute top-8 left-0 right-0 z-10">
              <Container>
                <div className="text-white text-center">
                  <h1 className="text-3xl font-bold mb-2">Products Details</h1>
                  <p className="text-sm text-gray-300">Home / Product Details</p>
                </div>
              </Container>
            </div>

            {/* Product Info Card Overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <Container>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-t-3xl p-8 max-w-4xl mx-auto shadow-2xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(product.rate)}
                  </div>
                  
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h2>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-[#4d0d0d]">
                      EGP {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-2xl text-gray-400 line-through">
                        EGP {product.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuantityChange(-1)}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#FFB800] transition-colors"
                      >
                        <MinusIcon className="w-5 h-5 text-gray-700" />
                      </motion.button>
                      <span className="text-xl font-semibold text-gray-900 w-8 text-center">
                        {quantity.toString().padStart(2, '0')}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuantityChange(1)}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#FFB800] transition-colors"
                      >
                        <PlusIcon className="w-5 h-5 text-gray-700" />
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="flex-1 border-2 border-[#FFB800] text-gray-900 font-bold py-4 px-8 rounded-lg hover:bg-[#FFB800] transition-colors text-lg"
                    >
                      ADD TO BASKET
                    </motion.button>
                  </div>
                </motion.div>
              </Container>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white">
            <Container>
              <div className="py-12 max-w-6xl mx-auto space-y-12">
                {/* Supplier Section */}
                {product.restaurant && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-[#4d0d0d]">Supplier</h3>
                    <div className="flex items-start gap-6">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden shrink-0">
                        {product.restaurant.imageUrl ? (
                          <ImageWithLoader
                            src={product.restaurant.imageUrl}
                            alt={product.restaurant.name}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg
                              className="w-16 h-16 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {renderStars(product.restaurant.rating)}
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900">{product.restaurant.name}</h4>
                        <p className="text-lg text-gray-600">{product.restaurant.type}</p>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPinIcon className="w-5 h-5 text-[#4d0d0d]" />
                          <span>{product.restaurant.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description Section */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#4d0d0d]">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {description}
                  </p>
                </div>

                {/* Customer Reviews Section */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-[#4d0d0d]">Customer Reviews</h3>
                  
                  {user && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <ReviewForm
                        productId={productId}
                        existingReview={userReview ? { rating: userReview.rating, comment: userReview.comment } : null}
                        onSuccess={() => {
                          setRefetchReviews((prev) => prev + 1);
                          refetchProduct();
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-6">
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review, index) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4 p-6 bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                            {review.user?.image ? (
                              <ImageWithLoader
                                src={review.user.image}
                                alt={review.user.fullName || 'User'}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 text-xl font-medium">
                                  {(review.user?.fullName || 'U')[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-lg font-semibold text-gray-900">
                                {review.user?.fullName || 'Anonymous'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {renderStars(review.rating)}
                            </div>
                            {review.comment && (
                              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No reviews yet. Be the first to review!
                      </p>
                    )}
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuantityChange(-1)}
                className="w-10 h-10 rounded-full bg-[#4d0d0d] text-white flex items-center justify-center"
              >
                <MinusIcon className="w-5 h-5" />
              </motion.button>
              <span className="text-lg font-semibold text-gray-900 w-8 text-center">
                {quantity.toString().padStart(2, '0')}
              </span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 rounded-full bg-[#4d0d0d] text-white flex items-center justify-center"
              >
                <PlusIcon className="w-5 h-5" />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="flex-1 bg-[#FFB800] text-[#4d0d0d] font-bold py-3 px-6 rounded-lg"
            >
              ADD TO BASKET
            </motion.button>
          </div>
        </Container>
      </div>

      <AddedToBasketModal
        isOpen={showAddedModal}
        onClose={() => setShowAddedModal(false)}
        onContinueShopping={() => {}}
      />
    </div>
  );
}

