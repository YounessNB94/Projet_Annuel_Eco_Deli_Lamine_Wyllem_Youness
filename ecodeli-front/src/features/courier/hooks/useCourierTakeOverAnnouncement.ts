import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CourierAssignmentResult,
  CourierAvailableAnnouncement,
} from '../api/courierAnnouncements';
import { takeOverCourierAnnouncement } from '../api/courierAnnouncements';

export const useCourierTakeOverAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation<CourierAssignmentResult, Error, string>({
    mutationFn: takeOverCourierAnnouncement,
    onSuccess: (result) => {
      queryClient.setQueryData<CourierAvailableAnnouncement[] | undefined>(
        ['courier', 'announcements', 'available'],
        (current) => current?.filter((announcement) => announcement.id !== result.announcementId),
      );
    },
  });
};
