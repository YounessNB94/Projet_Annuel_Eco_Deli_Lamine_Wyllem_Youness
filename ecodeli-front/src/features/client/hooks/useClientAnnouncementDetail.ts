import { useQuery } from '@tanstack/react-query';
import { fetchClientAnnouncementDetail } from '../api/clientAnnouncementDetails';
import type { AnnouncementDetail } from '../api/clientAnnouncementDetails';

export const useClientAnnouncementDetail = (announcementId?: string) =>
  useQuery<AnnouncementDetail>({
    queryKey: ['client', 'announcements', 'detail', announcementId],
    enabled: !!announcementId,
    queryFn: () => fetchClientAnnouncementDetail(announcementId as string),
  });
