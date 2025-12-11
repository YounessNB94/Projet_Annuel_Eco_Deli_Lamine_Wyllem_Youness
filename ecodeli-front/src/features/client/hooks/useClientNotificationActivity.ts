import { useQuery } from '@tanstack/react-query';
import {
  fetchClientNotificationActivity,
  type ClientNotificationActivityRecord,
} from '../api/clientNotifications';

export const useClientNotificationActivity = () =>
  useQuery<ClientNotificationActivityRecord[]>({
    queryKey: ['client', 'notifications', 'activity'],
    queryFn: fetchClientNotificationActivity,
  });
