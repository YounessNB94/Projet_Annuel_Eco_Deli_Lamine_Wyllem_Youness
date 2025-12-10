import { httpClient } from '../../../shared/api/httpClient';

export type ProviderUnavailabilityRecurrence = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface ProviderUnavailabilityRequestBody {
  startAt: string;
  endAt: string;
  reason?: string;
  recurrence?: Exclude<ProviderUnavailabilityRecurrence, 'NONE'>;
}

export interface ProviderAssignmentConfirmationPayload {
  message?: string;
  eta?: string;
}

export const createProviderUnavailability = async (
  providerId: string,
  payload: ProviderUnavailabilityRequestBody
) => {
  const { data } = await httpClient.post(`/providers/${providerId}/unavailabilities`, payload);
  return data;
};

export const confirmProviderAssignment = async (
  assignmentId: string,
  payload: ProviderAssignmentConfirmationPayload
) => {
  const { data } = await httpClient.post(`/assignments/${assignmentId}/confirm`, payload);
  return data;
};
