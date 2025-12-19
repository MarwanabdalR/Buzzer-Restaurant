'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface AddedToBasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const AddedToBasketModal: React.FC<AddedToBasketModalProps> = ({
  isOpen,
  onClose,
  onContinueShopping,
}) => {
  const router = useRouter();

  const handleViewBasket = () => {
    onClose();
    router.push('/cart');
  };

  const handleContinueShopping = () => {
    onClose();
    onContinueShopping();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleContinueShopping}
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-w-md mx-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Added to Basket</h2>
              <p className="text-gray-600">You item has been successfully added to the basket.</p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinueShopping}
                className="flex-1 border-2 border-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                CONT. SHOPPING
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewBasket}
                className="flex-1 bg-[#FFB800] text-[#4d0d0d] font-bold py-3 px-6 rounded-lg hover:bg-[#e6a600] transition-colors"
              >
                VIEW BASKET
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

