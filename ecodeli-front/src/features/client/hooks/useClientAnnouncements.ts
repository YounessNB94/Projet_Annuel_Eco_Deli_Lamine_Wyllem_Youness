import { useQuery } from '@tanstack/react-query';
import type { Announcement} from '../api/clientAnnouncements';
import { fetchClientAnnouncements } from '../api/clientAnnouncements';

export const useClientAnnouncements = () =>
  useQuery<Announcement[]>({
    queryKey: ['client', 'announcements'],
    queryFn: fetchClientAnnouncements,
  });
