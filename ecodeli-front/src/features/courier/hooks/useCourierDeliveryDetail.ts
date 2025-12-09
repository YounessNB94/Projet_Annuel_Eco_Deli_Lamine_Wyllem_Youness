import { useQuery } from '@tanstack/react-query';
import type { CourierDeliveryDetail } from '../api/courierDeliveries';
import { fetchCourierDeliveryDetail } from '../api/courierDeliveries';

export const useCourierDeliveryDetail = (deliveryId?: string) =>
  useQuery<CourierDeliveryDetail>({
    queryKey: ['courier', 'deliveries', deliveryId],
    enabled: !!deliveryId,
    queryFn: () => fetchCourierDeliveryDetail(deliveryId as string),
  });
