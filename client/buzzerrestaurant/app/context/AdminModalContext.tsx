'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Restaurant } from '../types';
import { Category } from '../types/category';
import { Product } from '../types/product';

type ModalType = 'restaurant' | 'category' | 'product' | null;
type ModalAction = 'create' | 'edit';

interface AdminModalState {
  isOpen: boolean;
  type: ModalType;
  action: ModalAction;
  data: Restaurant | Category | Product | null;
}

interface AdminModalContextType {
  modalState: AdminModalState;
  openRestaurantModal: (action: ModalAction, data?: Restaurant | null) => void;
  openCategoryModal: (action: ModalAction, data?: Category | null) => void;
  openProductModal: (action: ModalAction, data?: Product | null) => void;
  closeModal: () => void;
}

const AdminModalContext = createContext<AdminModalContextType | undefined>(undefined);

export const useAdminModal = () => {
  const context = useContext(AdminModalContext);
  if (context === undefined) {
    throw new Error('useAdminModal must be used within an AdminModalProvider');
  }
  return context;
};

interface AdminModalProviderProps {
  children: ReactNode;
}

export const AdminModalProvider: React.FC<AdminModalProviderProps> = ({ children }) => {
  const [modalState, setModalState] = useState<AdminModalState>({
    isOpen: false,
    type: null,
    action: 'create',
    data: null,
  });

  const openRestaurantModal = (action: ModalAction, data?: Restaurant | null) => {
    setModalState({
      isOpen: true,
      type: 'restaurant',
      action,
      data: data || null,
    });
  };

  const openCategoryModal = (action: ModalAction, data?: Category | null) => {
    setModalState({
      isOpen: true,
      type: 'category',
      action,
      data: data || null,
    });
  };

  const openProductModal = (action: ModalAction, data?: Product | null) => {
    setModalState({
      isOpen: true,
      type: 'product',
      action,
      data: data || null,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      action: 'create',
      data: null,
    });
  };

  const value: AdminModalContextType = {
    modalState,
    openRestaurantModal,
    openCategoryModal,
    openProductModal,
    closeModal,
  };

  return <AdminModalContext.Provider value={value}>{children}</AdminModalContext.Provider>;
};

