import axiosInstance from '../api/axiosInstance';

export const submitContact = async (contactData) => {
  const response = await axiosInstance.post('/contact', contactData);
  return response.data;
};
