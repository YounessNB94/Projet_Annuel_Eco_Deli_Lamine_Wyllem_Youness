import { useQuery } from '@tanstack/react-query';
import {
  fetchAdminAnnouncementsDeliveriesData,
  type AdminAnnouncementsDeliveriesData,
} from '../api/adminAnnouncementsDeliveries';

export const useAdminAnnouncementsDeliveriesData = () =>
  useQuery<AdminAnnouncementsDeliveriesData>({
    queryKey: ['admin', 'announcements-deliveries'],
    queryFn: fetchAdminAnnouncementsDeliveriesData,
  });
