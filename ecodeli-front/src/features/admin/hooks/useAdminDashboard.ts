import { useQuery } from '@tanstack/react-query';
import { fetchAdminDashboardData, type AdminDashboardData } from '../api/adminDashboard';

export const useAdminDashboardData = () =>
  useQuery<AdminDashboardData>({
    queryKey: ['admin', 'dashboard'],
    queryFn: fetchAdminDashboardData,
  });
