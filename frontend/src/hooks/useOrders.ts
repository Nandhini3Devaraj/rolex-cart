import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';

export const orderKeys = {
  all: ['orders'] as const,
  list: (filters?: { status?: string }) => ['orders', 'list', filters] as const,
  detail: (id: string) => ['orders', id] as const,
  customer: (customerId: string) => ['orders', 'customer', customerId] as const,
};

export function useOrders(filters?: { status?: string }) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => orderService.getAllOrders(filters),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
}

export function useCustomerOrders(customerId: string) {
  return useQuery({
    queryKey: orderKeys.customer(customerId),
    queryFn: () => orderService.getOrdersByCustomer(customerId),
    enabled: !!customerId,
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status: Order['status']; notes?: string };
    }) => orderService.updateOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderService.deleteOrder(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}
