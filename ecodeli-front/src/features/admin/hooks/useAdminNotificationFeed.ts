import { useQuery } from '@tanstack/react-query';
import {
  fetchAdminNotificationFeed,
  type AdminNotificationRecord,
} from '../api/adminNotifications';

export const useAdminNotificationFeed = () =>
  useQuery<AdminNotificationRecord[]>({
    queryKey: ['admin', 'notifications', 'feed'],
    queryFn: fetchAdminNotificationFeed,
  });
