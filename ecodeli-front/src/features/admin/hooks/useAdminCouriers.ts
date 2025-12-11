import { useQuery } from '@tanstack/react-query';
import { fetchAdminCouriersData, type AdminCouriersData } from '../api/adminCouriers';

export const useAdminCouriersData = () =>
  useQuery<AdminCouriersData>({
    queryKey: ['admin', 'couriers'],
    queryFn: fetchAdminCouriersData,
  });
