import { useQuery } from '@tanstack/react-query';
import { fetchClientPayments, type ClientPayment } from '../api/clientPayments';

export const useClientPayments = () =>
  useQuery<ClientPayment[]>({
    queryKey: ['client', 'payments'],
    queryFn: fetchClientPayments,
  });
