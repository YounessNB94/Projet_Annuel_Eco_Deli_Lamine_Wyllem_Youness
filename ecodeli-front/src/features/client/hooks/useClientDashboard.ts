import { useQuery } from '@tanstack/react-query';
import { fetchClientDashboard, type ClientDashboardData } from '../api/clientDashboard';

export const useClientDashboard = () =>
  useQuery<ClientDashboardData>({
    queryKey: ['client', 'dashboard'],
    queryFn: () => {
      console.log('Fetching client dashboard data');
      const data = fetchClientDashboard();
        console.log('Fetched data:', data);
      return data;
    },
  });
