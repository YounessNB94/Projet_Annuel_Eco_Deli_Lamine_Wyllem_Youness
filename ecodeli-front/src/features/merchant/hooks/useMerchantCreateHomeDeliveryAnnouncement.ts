import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMerchantHomeDeliveryAnnouncement,
  type MerchantHomeDeliveryAnnouncementPayload,
  type MerchantHomeDeliveryAnnouncementResponse,
} from '../api/merchantAnnouncements';

export const useMerchantCreateHomeDeliveryAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation<
    MerchantHomeDeliveryAnnouncementResponse,
    Error,
    MerchantHomeDeliveryAnnouncementPayload
  >({
    mutationFn: createMerchantHomeDeliveryAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant', 'announcements'] });
    },
  });
};
