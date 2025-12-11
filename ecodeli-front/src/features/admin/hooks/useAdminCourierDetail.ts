import { useQuery } from '@tanstack/react-query';
import {
  DEFAULT_ADMIN_COURIER_ID,
  fetchAdminCourierActivity,
  fetchAdminCourierDocuments,
  fetchAdminCourierProfile,
  type AdminCourierActivityRecord,
  type AdminCourierDocumentRecord,
  type AdminCourierProfile,
} from '../api/adminCourierDetail';

const resolveCourierId = (courierId?: string) => courierId ?? DEFAULT_ADMIN_COURIER_ID;

export const useAdminCourierProfile = (courierId?: string) =>
  useQuery<AdminCourierProfile | undefined>({
    queryKey: ['admin', 'couriers', 'profile', resolveCourierId(courierId)],
    queryFn: () => fetchAdminCourierProfile(resolveCourierId(courierId)),
  });

export const useAdminCourierDocuments = (courierId?: string) =>
  useQuery<AdminCourierDocumentRecord[]>({
    queryKey: ['admin', 'couriers', 'documents', resolveCourierId(courierId)],
    queryFn: () => fetchAdminCourierDocuments(resolveCourierId(courierId)),
  });

export const useAdminCourierActivity = (courierId?: string) =>
  useQuery<AdminCourierActivityRecord[]>({
    queryKey: ['admin', 'couriers', 'activity', resolveCourierId(courierId)],
    queryFn: () => fetchAdminCourierActivity(resolveCourierId(courierId)),
  });
