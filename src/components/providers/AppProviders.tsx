'use client';

import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { CartProvider } from '../../context/CartContext';
import { ModalProvider } from '../../context/ModalContext';
import { CurrencyProvider } from '../../context/CurrencyContext';
import { ProductProvider } from '../../context/ProductContext';
import { AdminProvider } from '../../context/AdminContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ModalProvider>
            <CurrencyProvider>
              <ProductProvider>
                <AdminProvider>
                  {children}
                </AdminProvider>
              </ProductProvider>
            </CurrencyProvider>
          </ModalProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
