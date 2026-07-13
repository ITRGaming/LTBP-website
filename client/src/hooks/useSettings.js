import { useQuery } from '@tanstack/react-query';
import { fetchSettings } from '../services/settingsService';

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
