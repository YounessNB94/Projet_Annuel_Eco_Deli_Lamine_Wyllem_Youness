import { useQuery } from '@tanstack/react-query';
import { fetchMerchantContract } from '../api/merchantContract';
import type { MerchantContract } from '../api/merchantContract';

export const useMerchantContract = () =>
  useQuery<MerchantContract>({
    queryKey: ['merchant', 'contract'],
    queryFn: fetchMerchantContract,
    staleTime: 1000 * 60 * 5,
  });
