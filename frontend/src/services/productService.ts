import { apiClient, apiCall, mockDb } from './api';
import { Product } from '../types';

export const productService = {
  getAllProducts: async (params?: { search?: string; category?: string; sort?: string }): Promise<Product[]> => {
    return apiCall<Product[]>(
      async () => {
        const { data } = await apiClient.get('/products', { params });
        return Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
      },
      () => {
        let products = mockDb.getProducts();
        if (params?.category) products = products.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
        if (params?.search) {
          const q = params.search.toLowerCase();
          products = products.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        }
        if (params?.sort === 'price-low') products.sort((a, b) => a.price - b.price);
        else if (params?.sort === 'price-high') products.sort((a, b) => b.price - a.price);
        else products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return products;
      }
    );
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    return apiCall<Product[]>(
      async () => {
        const { data } = await apiClient.get(`/products/search/${query}`);
        return Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
      },
      () => {
        const q = query.toLowerCase();
        return mockDb.getProducts().filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      }
    );
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    return apiCall<Product[]>(
      async () => {
        const { data } = await apiClient.get(`/products/category/${category}`);
        return Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
      },
      () => mockDb.getProducts().filter((p) => p.category.toLowerCase() === category.toLowerCase())
    );
  },

  getProductById: async (id: string): Promise<Product> => {
    return apiCall<Product>(
      async () => {
        const { data } = await apiClient.get(`/products/${id}`);
        return data.data || data;
      },
      () => {
        const product = mockDb.getProducts().find((p) => p._id === id);
        if (!product) throw new Error('Product not found');
        return product;
      }
    );
  },

  createProduct: async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    return apiCall<Product>(
      async () => {
        const { data } = await apiClient.post('/products', productData);
        return data.data || data;
      },
      () => {
        const newProduct: Product = { ...productData, _id: `p-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        mockDb.setProducts([...mockDb.getProducts(), newProduct]);
        return newProduct;
      }
    );
  },

  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    return apiCall<Product>(
      async () => {
        const { data } = await apiClient.put(`/products/${id}`, productData);
        return data.data || data;
      },
      () => {
        const products = mockDb.getProducts();
        let updatedProduct: Product | null = null;
        const updated = products.map((p) => {
          if (p._id === id) { updatedProduct = { ...p, ...productData, updatedAt: new Date().toISOString() }; return updatedProduct; }
          return p;
        });
        if (!updatedProduct) throw new Error('Product not found');
        mockDb.setProducts(updated);
        return updatedProduct;
      }
    );
  },

  deleteProduct: async (id: string): Promise<{ message: string }> => {
    return apiCall<{ message: string }>(
      async () => {
        const { data } = await apiClient.delete(`/products/${id}`);
        return data;
      },
      () => {
        mockDb.setProducts(mockDb.getProducts().filter((p) => p._id !== id));
        return { message: 'Product deleted successfully' };
      }
    );
  },

  addReview: async (productId: string, rating: number, comment: string): Promise<Product> => {
    return apiCall<Product>(
      async () => {
        const { data } = await apiClient.post(`/products/${productId}/reviews`, { rating, comment });
        return data.data || data;
      },
      () => {
        throw new Error('Reviews not supported in mock mode');
      }
    );
  },
};
