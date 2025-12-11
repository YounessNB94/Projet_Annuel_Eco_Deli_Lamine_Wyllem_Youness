import { useQuery } from '@tanstack/react-query';
import {
  fetchProviderNotificationFeed,
  type ProviderNotificationRecord,
} from '../api/providerNotifications';

export const useProviderNotificationFeed = () =>
  useQuery<ProviderNotificationRecord[]>({
    queryKey: ['provider', 'notifications', 'feed'],
    queryFn: fetchProviderNotificationFeed,
  });
