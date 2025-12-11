import { useQuery } from '@tanstack/react-query';
import { fetchAdminInvoicesData } from '../api/adminInvoices';

export const useAdminInvoicesData = () =>
  useQuery({
    queryKey: ['admin', 'invoices'],
    queryFn: fetchAdminInvoicesData,
  });
