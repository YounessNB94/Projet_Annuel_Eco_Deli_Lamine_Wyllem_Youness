import { useQuery } from '@tanstack/react-query';
import { fetchClientDeliveries } from '../api/clientDeliveries';
import type { Delivery } from '../api/clientDeliveries';

export const useClientDeliveries = () =>
  useQuery<Delivery[]>({
    queryKey: ['client', 'deliveries'],
    queryFn: fetchClientDeliveries,
  });
