import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  AdvanceCourierDeliveryStatusInput,
  CourierDelivery,
  CourierDeliveryDetail,
} from '../api/courierDeliveries';
import { advanceCourierDeliveryStatus } from '../api/courierDeliveries';

export const useCourierAdvanceDeliveryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<CourierDeliveryDetail, Error, AdvanceCourierDeliveryStatusInput>({
    mutationFn: advanceCourierDeliveryStatus,
    onSuccess: (updated) => {
      queryClient.setQueryData<CourierDeliveryDetail | undefined>(
        ['courier', 'deliveries', updated.id],
        updated,
      );

      queryClient.setQueryData<CourierDelivery[] | undefined>(
        ['courier', 'deliveries'],
        (current) =>
          current?.map((delivery) =>
            delivery.id === updated.id ? { ...delivery, status: updated.status } : delivery,
          ),
      );
    },
  });
};
