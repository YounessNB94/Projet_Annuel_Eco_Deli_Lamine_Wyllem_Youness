import { useQuery } from '@tanstack/react-query';
import type { CourierDelivery } from '../api/courierDeliveries';
import { fetchCourierDeliveries } from '../api/courierDeliveries';

export const useCourierDeliveries = () =>
  useQuery<CourierDelivery[]>({
    queryKey: ['courier', 'deliveries'],
    queryFn: fetchCourierDeliveries,
  });
