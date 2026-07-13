import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchFeaturedProducts } from '../services/productService';

export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: fetchFeaturedProducts,
  });
};
