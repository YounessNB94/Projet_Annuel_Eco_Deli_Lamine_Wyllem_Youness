import { useQuery } from '@tanstack/react-query';
import type { CourierAvailableAnnouncement } from '../api/courierAnnouncements';
import { fetchCourierAvailableAnnouncements } from '../api/courierAnnouncements';

export const useCourierAvailableAnnouncements = () =>
  useQuery<CourierAvailableAnnouncement[]>({
    queryKey: ['courier', 'announcements', 'available'],
    queryFn: fetchCourierAvailableAnnouncements,
  });
