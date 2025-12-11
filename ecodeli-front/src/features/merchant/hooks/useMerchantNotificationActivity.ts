import { useQuery } from '@tanstack/react-query';
import {
  fetchMerchantNotificationActivity,
  type MerchantNotificationActivityRecord,
} from '../api/merchantNotifications';

export const useMerchantNotificationActivity = () =>
  useQuery<MerchantNotificationActivityRecord[]>({
    queryKey: ['merchant', 'notifications', 'activity'],
    queryFn: fetchMerchantNotificationActivity,
  });
