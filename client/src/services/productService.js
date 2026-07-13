import axiosInstance from '../api/axiosInstance';

export const fetchProducts = async ({ search = '', category = '', page = 1, limit = 12 } = {}) => {
  const params = { page, limit };
  if (search) params.search = search;
  if (category) params.category = category;
  
  const response = await axiosInstance.get('/products', { params });
  return response.data.data; // Returns { products, pagination }
};

export const fetchFeaturedProducts = async () => {
  const response = await axiosInstance.get('/products/featured');
  return response.data.data;
};

export const fetchProductBySlug = async (slug) => {
  const response = await axiosInstance.get(`/products/${slug}`);
  return response.data.data;
};
