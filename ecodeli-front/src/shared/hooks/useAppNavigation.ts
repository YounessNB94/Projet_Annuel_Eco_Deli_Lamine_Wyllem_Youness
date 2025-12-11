import { useQuery } from '@tanstack/react-query';
import { fetchAppNavigationData } from '../api/appNavigation';

export const useAppNavigation = () =>
  useQuery({
    queryKey: ['shared', 'app-navigation'],
    queryFn: fetchAppNavigationData,
  });
