import { useQuery } from '@tanstack/react-query';
import { fetchClientPaymentDetail, type ClientPaymentDetail } from '../api/clientPayments';

export const useClientPaymentDetail = (paymentId: string | undefined) =>
  useQuery<ClientPaymentDetail | null>({
    queryKey: ['client', 'payments', paymentId],
    queryFn: () => (paymentId ? fetchClientPaymentDetail(paymentId) : Promise.resolve(null)),
    enabled: Boolean(paymentId),
  });
