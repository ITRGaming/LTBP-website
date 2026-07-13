import axiosInstance from '../api/axiosInstance';

export const fetchTestimonials = async () => {
  const response = await axiosInstance.get('/testimonials');
  return response.data.data;
};
