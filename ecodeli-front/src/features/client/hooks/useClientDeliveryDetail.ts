import { useQuery } from '@tanstack/react-query';
import {
  fetchClientDeliveryDetail,
} from '../api/clientDeliveryDetails';
import type { DeliveryDetail } from '../api/clientDeliveryDetails';

export const useClientDeliveryDetail = (deliveryId: string | undefined) =>
  useQuery<DeliveryDetail>({
    queryKey: ['client', 'deliveries', deliveryId],
    enabled: !!deliveryId,
    queryFn: () => fetchClientDeliveryDetail(deliveryId as string),
  });
