import { useQuery } from '@tanstack/react-query';
import {
  fetchMerchantNotificationFeed,
  type MerchantNotificationRecord,
} from '../api/merchantNotifications';

export const useMerchantNotificationFeed = () =>
  useQuery<MerchantNotificationRecord[]>({
    queryKey: ['merchant', 'notifications', 'feed'],
    queryFn: fetchMerchantNotificationFeed,
  });
