import { useQuery } from '@tanstack/react-query';
import {
  fetchClientNotificationFeed,
  type ClientNotificationRecord,
} from '../api/clientNotifications';

export const useClientNotificationFeed = () =>
  useQuery<ClientNotificationRecord[]>({
    queryKey: ['client', 'notifications', 'feed'],
    queryFn: fetchClientNotificationFeed,
  });
