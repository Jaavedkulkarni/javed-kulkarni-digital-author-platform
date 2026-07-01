import { createContext, useContext, ReactNode } from 'react';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  searchProducts,
  updateProduct,
} from '../lib/productService';
import {
  Book,
  BookFilters,
  BookFormData,
  BookListItem,
  PaginatedBooks,
} from '../types/book';
import type { Product, ProductFormData } from '../types/productEntity';

interface BookContextType {
  getBooks: (filters?: BookFilters) => Promise<PaginatedBooks>;
  getBook: (id: string) => Promise<Book | null>;
  createBook: (data: Partial<BookFormData>) => Promise<Book | null>;
  updateBook: (id: string, data: Partial<BookFormData>) => Promise<Book | null>;
  deleteBook: (id: string) => Promise<boolean>;
  searchBooks: (query: string, page?: number, limit?: number) => Promise<PaginatedBooks>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

function productToBook(product: Product): Book {
  return product as unknown as Book;
}

function bookFormToProductForm(data: Partial<BookFormData>): Partial<ProductFormData> {
  return data as Partial<ProductFormData>;
}

function productListToBookList(items: Product[]): BookListItem[] {
  return items as unknown as BookListItem[];
}

export function BookProvider({ children }: { children: ReactNode }) {
  const getBooks = async (filters?: BookFilters): Promise<PaginatedBooks> => {
    const result = await getProducts(filters);
    return {
      ...result,
      data: productListToBookList(result.data as unknown as Product[]),
    };
  };

  const getBook = async (id: string): Promise<Book | null> => {
    const product = await getProduct(id);
    return product ? productToBook(product) : null;
  };

  const createBook = async (data: Partial<BookFormData>): Promise<Book | null> => {
    const product = await createProduct(bookFormToProductForm(data), 'book');
    return product ? productToBook(product) : null;
  };

  const updateBook = async (id: string, data: Partial<BookFormData>): Promise<Book | null> => {
    const product = await updateProduct(id, bookFormToProductForm(data));
    return product ? productToBook(product) : null;
  };

  const deleteBook = async (id: string): Promise<boolean> => deleteProduct(id);

  const searchBooks = async (query: string, page = 1, limit = 15): Promise<PaginatedBooks> => {
    const result = await searchProducts(query, page, limit);
    return {
      ...result,
      data: productListToBookList(result.data as unknown as Product[]),
    };
  };

  return (
    <BookContext.Provider
      value={{ getBooks, getBook, createBook, updateBook, deleteBook, searchBooks }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}
