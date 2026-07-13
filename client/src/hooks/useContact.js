import { useMutation } from '@tanstack/react-query';
import { submitContact } from '../services/contactService';

export const useContact = () => {
  return useMutation({
    mutationFn: submitContact,
  });
};
