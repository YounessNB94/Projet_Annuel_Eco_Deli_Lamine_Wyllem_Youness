import { useQuery } from '@tanstack/react-query';
import {
  fetchAdminNotificationActivity,
  type AdminNotificationActivityRecord,
} from '../api/adminNotifications';

export const useAdminNotificationActivity = () =>
  useQuery<AdminNotificationActivityRecord[]>({
    queryKey: ['admin', 'notifications', 'activity'],
    queryFn: fetchAdminNotificationActivity,
  });
