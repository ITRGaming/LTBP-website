import { useQuery } from '@tanstack/react-query';
import { fetchProductBySlug } from '../services/productService';

export const useProductDetails = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });
};
