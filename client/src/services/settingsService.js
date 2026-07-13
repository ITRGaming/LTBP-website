import axiosInstance from '../api/axiosInstance';

export const fetchSettings = async () => {
  const response = await axiosInstance.get('/settings');
  return response.data.data;
};
