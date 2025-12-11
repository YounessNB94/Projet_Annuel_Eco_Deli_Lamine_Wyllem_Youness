import { useQuery } from '@tanstack/react-query';
import {
  fetchCourierNotificationActivity,
  type CourierNotificationActivityRecord,
} from '../api/courierNotifications';

export const useCourierNotificationActivity = () =>
  useQuery<CourierNotificationActivityRecord[]>({
    queryKey: ['courier', 'notifications', 'activity'],
    queryFn: fetchCourierNotificationActivity,
  });
