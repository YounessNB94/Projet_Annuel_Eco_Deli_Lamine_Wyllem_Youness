import { useQuery } from '@tanstack/react-query';
import {
  fetchProviderNotificationActivity,
  type ProviderNotificationActivityRecord,
} from '../api/providerNotifications';

export const useProviderNotificationActivity = () =>
  useQuery<ProviderNotificationActivityRecord[]>({
    queryKey: ['provider', 'notifications', 'activity'],
    queryFn: fetchProviderNotificationActivity,
  });
