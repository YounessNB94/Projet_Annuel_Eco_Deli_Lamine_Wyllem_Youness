import { useQuery } from '@tanstack/react-query';
import {
  fetchMerchantAnnouncements,
  type MerchantAnnouncement,
} from '../api/merchantAnnouncements';

export const useMerchantAnnouncements = () =>
  useQuery<MerchantAnnouncement[]>({
    queryKey: ['merchant', 'announcements'],
    queryFn: fetchMerchantAnnouncements,
    staleTime: 1000 * 60 * 5,
  });
