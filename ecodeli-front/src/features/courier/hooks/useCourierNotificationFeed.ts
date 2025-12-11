import { useQuery } from '@tanstack/react-query';
import {
  fetchCourierNotificationFeed,
  type CourierNotificationRecord,
} from '../api/courierNotifications';

export const useCourierNotificationFeed = () =>
  useQuery<CourierNotificationRecord[]>({
    queryKey: ['courier', 'notifications', 'feed'],
    queryFn: fetchCourierNotificationFeed,
  });
