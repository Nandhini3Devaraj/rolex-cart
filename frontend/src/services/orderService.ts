import { apiClient, apiCall, mockDb } from './api';
import { Order } from '../types';

export const orderService = {
  getAllOrders: async (params?: { status?: string }): Promise<Order[]> => {
    return apiCall<Order[]>(
      async () => {
        const { data } = await apiClient.get('/orders', { params });
        return Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
      },
      () => {
        const orders = mockDb.getOrders();
        return params?.status ? orders.filter((o) => o.status.toLowerCase() === params.status!.toLowerCase()) : orders;
      }
    );
  },

  getOrderById: async (id: string): Promise<Order> => {
    return apiCall<Order>(
      async () => {
        const { data } = await apiClient.get(`/orders/${id}`);
        return data.data || data;
      },
      () => {
        const order = mockDb.getOrders().find((o) => o._id === id);
        if (!order) throw new Error('Order not found');
        return order;
      }
    );
  },

  getOrdersByCustomer: async (customerId: string): Promise<Order[]> => {
    return apiCall<Order[]>(
      async () => {
        const { data } = await apiClient.get(`/orders/customer/${customerId}`);
        return Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
      },
      () => mockDb.getOrders().filter((o) => o.customer._id === customerId)
    );
  },

  getOrdersByStatus: async (status: string): Promise<Order[]> => {
    return apiCall<Order[]>(
      async () => {
        const { data } = await apiClient.get(`/orders/status/${status}`);
        return Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
      },
      () => mockDb.getOrders().filter((o) => o.status.toLowerCase() === status.toLowerCase())
    );
  },

  createOrder: async (
    orderData: {
      products: { product: string; quantity: number }[];
      shippingAddress: { street: string; city: string; state: string; postalCode: string; country: string };
      notes?: string;
    },
    customerInfo: { _id: string; name: string; email: string }
  ): Promise<Order> => {
    return apiCall<Order>(
      async () => {
        const { data } = await apiClient.post('/orders', orderData);
        return data.data || data;
      },
      () => {
        const products = mockDb.getProducts();
        const orderProducts = orderData.products.map((item) => {
          const product = products.find((p) => p._id === item.product);
          if (!product) throw new Error('Product not found');
          if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} available.`);
          return { product, quantity: item.quantity, price: product.price };
        });
        mockDb.setProducts(products.map((p) => {
          const item = orderData.products.find((i) => i.product === p._id);
          return item ? { ...p, stock: p.stock - item.quantity } : p;
        }));
        const totalAmount = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newOrder: Order = {
          _id: `o-${Date.now()}`,
          customer: customerInfo,
          products: orderProducts.map((op) => ({ product: { _id: op.product._id, name: op.product.name, price: op.price, image: op.product.image }, quantity: op.quantity, price: op.price })),
          totalAmount,
          status: 'Pending',
          shippingAddress: orderData.shippingAddress,
          notes: orderData.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockDb.setOrders([newOrder, ...mockDb.getOrders()]);
        return newOrder;
      }
    );
  },

  updateOrder: async (id: string, orderData: { status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled'; notes?: string }): Promise<Order> => {
    return apiCall<Order>(
      async () => {
        const { data } = await apiClient.put(`/orders/${id}`, orderData);
        return data.data || data;
      },
      () => {
        const orders = mockDb.getOrders();
        let updatedOrder: Order | null = null;
        const updated = orders.map((o) => {
          if (o._id === id) { updatedOrder = { ...o, ...orderData, updatedAt: new Date().toISOString() }; return updatedOrder; }
          return o;
        });
        if (!updatedOrder) throw new Error('Order not found');
        mockDb.setOrders(updated);
        return updatedOrder;
      }
    );
  },

  deleteOrder: async (id: string): Promise<{ message: string }> => {
    return apiCall<{ message: string }>(
      async () => {
        const { data } = await apiClient.delete(`/orders/${id}`);
        return data;
      },
      () => {
        const orders = mockDb.getOrders();
        const order = orders.find((o) => o._id === id);
        if (!order) throw new Error('Order not found');
        const products = mockDb.getProducts();
        mockDb.setProducts(products.map((p) => {
          const op = order.products.find((i) => i.product._id === p._id);
          return op ? { ...p, stock: p.stock + op.quantity } : p;
        }));
        mockDb.setOrders(orders.filter((o) => o._id !== id));
        return { message: 'Order deleted and stock restored successfully' };
      }
    );
  },
};
