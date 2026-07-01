import { createContext, useContext, ReactNode } from 'react';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  searchProducts,
  updateProduct,
  clearFeaturedExcept,
} from '../lib/productService';
import type {
  PaginatedProducts,
  Product,
  ProductFilters,
  ProductFormData,
} from '../types/productEntity';

interface ProductContextType {
  getProducts: (filters?: ProductFilters) => Promise<PaginatedProducts>;
  getProduct: (id: string) => Promise<Product | null>;
  createProduct: (
    data: Partial<ProductFormData>,
    defaultTypeSlug?: string
  ) => Promise<Product | null>;
  updateProduct: (id: string, data: Partial<ProductFormData>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  searchProducts: (
    query: string,
    page?: number,
    limit?: number,
    filters?: Omit<ProductFilters, 'search' | 'page' | 'limit'>
  ) => Promise<PaginatedProducts>;
  clearFeaturedExcept: (exceptId?: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  return (
    <ProductContext.Provider
      value={{
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
        clearFeaturedExcept,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
