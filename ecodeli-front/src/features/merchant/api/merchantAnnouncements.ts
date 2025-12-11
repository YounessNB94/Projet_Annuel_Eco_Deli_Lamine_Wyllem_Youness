import { isAxiosError } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  MerchantHomeDeliveryFormValues,
  MerchantHomeDeliveryServiceLevel,
} from '../types/homeDeliveryAnnouncement';

export type MerchantAnnouncementStatus = 'DRAFT' | 'PUBLISHED';

export interface MerchantHomeDeliveryAnnouncementPayload {
  status: MerchantAnnouncementStatus;
  values: MerchantHomeDeliveryFormValues;
}

export interface MerchantHomeDeliveryAnnouncementResponse {
  id: string;
  status: MerchantAnnouncementStatus;
  reference: string;
  publishedAt?: string;
}

export interface MerchantAnnouncement {
  id: string;
  campaignName: string;
  reference: string;
  serviceLevel: MerchantHomeDeliveryServiceLevel;
  status: MerchantAnnouncementStatus;
  pickupWindow: {
    date: string;
    start: string;
    end: string;
  };
  deliveryWindow: {
    date: string;
    start: string;
    end: string;
  };
  deliveryCity: string;
  deliveryRadiusKm: number;
  packagesCount: number;
  averageWeight: number;
  budget: number;
  updatedAt: string;
}

interface MerchantAnnouncementResponse {
  id: number | string;
  campaignName?: string;
  title?: string;
  reference?: string;
  code?: string;
  serviceLevel?: string;
  status?: string;
  pickupDate?: string;
  pickupWindowDate?: string;
  pickupTimeStart?: string;
  pickupTimeEnd?: string;
  pickupWindowStart?: string;
  pickupWindowEnd?: string;
  pickupStartAt?: string;
  pickupEndAt?: string;
  deliveryDate?: string;
  deliveryWindowDate?: string;
  deliveryTimeStart?: string;
  deliveryTimeEnd?: string;
  deliveryWindowStart?: string;
  deliveryWindowEnd?: string;
  deliveryStartAt?: string;
  deliveryEndAt?: string;
  deliveryCity?: string;
  city?: string;
  deliveryRadiusKm?: number;
  deliveryRadius?: number;
  radiusKm?: number;
  packagesCount?: number;
  parcelCount?: number;
  packages?: number;
  averageWeight?: number;
  averageParcelWeight?: number;
  budget?: number;
  budgetAmount?: number;
  updatedAt?: string;
  updatedOn?: string;
  modifiedAt?: string;
  publishedAt?: string;
  createdAt?: string;
}

interface MerchantAnnouncementCreateResponse {
  id?: number | string;
  reference?: string;
  status?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const normalizeStatus = (status?: string): MerchantAnnouncementStatus => {
  switch (String(status ?? '').toUpperCase()) {
    case 'PUBLISHED':
    case 'ACTIVE':
      return 'PUBLISHED';
    case 'DRAFT':
    case 'PENDING':
    default:
      return 'DRAFT';
  }
};

const normalizeServiceLevel = (
  serviceLevel?: string,
): MerchantHomeDeliveryServiceLevel =>
  String(serviceLevel ?? '').toUpperCase() === 'EXPRESS' ? 'EXPRESS' : 'STANDARD';

const parseDate = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const formatDatePart = (value?: string) => {
  if (!value) {
    return 'Date à planifier';
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const date = parseDate(value);
  if (!date) {
    return value;
  }
  return date.toISOString().slice(0, 10);
};

const formatTimePart = (value?: string) => {
  if (!value) {
    return '--:--';
  }
  if (/^\d{2}:\d{2}$/.test(value)) {
    return value;
  }
  const date = parseDate(value);
  if (!date) {
    return value;
  }
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return '';
  }
  const date = parseDate(value);
  if (!date) {
    return value;
  }
  return date.toISOString();
};

const formatOptionalDateTime = (value?: string) => {
  const formatted = formatDateTime(value);
  return formatted.length > 0 ? formatted : undefined;
};

const toNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = Number(value.replace(',', '.'));
    if (Number.isFinite(normalized)) {
      return normalized;
    }
  }
  return undefined;
};

const toInteger = (value: unknown) => {
  const numeric = toNumber(value);
  if (numeric === undefined) {
    return undefined;
  }
  return Math.round(numeric);
};

const extractAnnouncementData = (
  data:
    | PaginatedResponse<MerchantAnnouncementResponse>
    | MerchantAnnouncementResponse[],
) => (Array.isArray(data) ? data : data.content ?? []);

const mapAnnouncement = (payload: MerchantAnnouncementResponse): MerchantAnnouncement => {
  const pickupStart =
    payload.pickupWindowStart ?? payload.pickupStartAt ?? payload.pickupTimeStart;
  const pickupEnd = payload.pickupWindowEnd ?? payload.pickupEndAt ?? payload.pickupTimeEnd;
  const deliveryStart =
    payload.deliveryWindowStart ?? payload.deliveryStartAt ?? payload.deliveryTimeStart;
  const deliveryEnd =
    payload.deliveryWindowEnd ?? payload.deliveryEndAt ?? payload.deliveryTimeEnd;

  return {
    id: String(payload.id),
    campaignName: payload.campaignName ?? payload.title ?? 'Campagne EcoDeli',
    reference: payload.reference ?? payload.code ?? `ANN-${payload.id}`,
    serviceLevel: normalizeServiceLevel(payload.serviceLevel),
    status: normalizeStatus(payload.status),
    pickupWindow: {
      date: formatDatePart(payload.pickupDate ?? payload.pickupWindowDate ?? pickupStart),
      start: formatTimePart(pickupStart),
      end: formatTimePart(pickupEnd),
    },
    deliveryWindow: {
      date: formatDatePart(
        payload.deliveryDate ?? payload.deliveryWindowDate ?? deliveryStart,
      ),
      start: formatTimePart(deliveryStart),
      end: formatTimePart(deliveryEnd),
    },
    deliveryCity: payload.deliveryCity ?? payload.city ?? 'Ville à confirmer',
    deliveryRadiusKm:
      toNumber(payload.deliveryRadiusKm ?? payload.deliveryRadius ?? payload.radiusKm) ?? 0,
    packagesCount: toInteger(payload.packagesCount ?? payload.parcelCount ?? payload.packages) ?? 0,
    averageWeight: toNumber(payload.averageWeight ?? payload.averageParcelWeight) ?? 0,
    budget: toNumber(payload.budgetAmount ?? payload.budget) ?? 0,
    updatedAt:
      formatDateTime(
        payload.updatedAt ?? payload.updatedOn ?? payload.modifiedAt ?? payload.publishedAt ?? payload.createdAt,
      ) || '',
  };
};

const buildCreateRequestBody = (
  payload: MerchantHomeDeliveryAnnouncementPayload,
) => {
  const { values } = payload;

  const deliveryRadius = toNumber(values.deliveryRadiusKm);
  const packagesCount = toInteger(values.packagesCount);
  const averageWeight = toNumber(values.averageWeight);
  const budget = toNumber(values.budget);
  const reference = values.reference.trim();

  return {
    status: payload.status,
    serviceType: values.serviceType,
    serviceLevel: values.serviceLevel,
    campaignName: values.campaignName,
    reference: reference.length > 0 ? reference : undefined,
    pickupAddress: values.pickupAddress,
    pickupCity: values.pickupCity,
    pickupPostalCode: values.pickupPostalCode,
    pickupDate: values.pickupDate,
    pickupTimeStart: values.pickupTimeStart,
    pickupTimeEnd: values.pickupTimeEnd,
    deliveryDate: values.deliveryDate,
    deliveryTimeStart: values.deliveryTimeStart,
    deliveryTimeEnd: values.deliveryTimeEnd,
    deliveryCity: values.deliveryCity,
    deliveryRadiusKm: deliveryRadius,
    packagesCount,
    averageWeight,
    budget,
    instructions: values.instructions,
    notificationMessage: values.notificationMessage,
    contactName: values.contactName,
    contactPhone: values.contactPhone,
    contactEmail: values.contactEmail,
    allowPartialDeliveries: values.allowPartialDeliveries,
    requiresSignature: values.requiresSignature,
    temperatureControlled: values.temperatureControlled,
    pickup: {
      address: values.pickupAddress,
      city: values.pickupCity,
      postalCode: values.pickupPostalCode,
      date: values.pickupDate,
      start: values.pickupTimeStart,
      end: values.pickupTimeEnd,
    },
    delivery: {
      date: values.deliveryDate,
      start: values.deliveryTimeStart,
      end: values.deliveryTimeEnd,
      city: values.deliveryCity,
      radiusKm: deliveryRadius,
    },
    metrics: {
      packagesCount,
      averageWeight,
      budget,
    },
    contact: {
      name: values.contactName,
      phone: values.contactPhone,
      email: values.contactEmail,
    },
    options: {
      allowPartialDeliveries: values.allowPartialDeliveries,
      requiresSignature: values.requiresSignature,
      temperatureControlled: values.temperatureControlled,
    },
  };
};

const mapCreateResponse = (
  payload: MerchantAnnouncementCreateResponse,
  fallbackReference: string,
  fallbackStatus: MerchantAnnouncementStatus,
): MerchantHomeDeliveryAnnouncementResponse => {
  const status = normalizeStatus(payload.status ?? fallbackStatus);
  return {
    id: String(payload.id ?? fallbackReference),
    reference: payload.reference ?? fallbackReference,
    status,
    publishedAt:
      status === 'PUBLISHED'
        ? formatOptionalDateTime(payload.publishedAt ?? payload.updatedAt ?? payload.createdAt) ??
          new Date().toISOString()
        : undefined,
  };
};

export const createMerchantHomeDeliveryAnnouncement = async (
  payload: MerchantHomeDeliveryAnnouncementPayload,
): Promise<MerchantHomeDeliveryAnnouncementResponse> => {
  const now = new Date();
  const providedReference = payload.values.reference.trim();
  const fallbackReference =
    providedReference.length > 0
      ? providedReference
      : `MHD-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
          .getTime()
          .toString()
          .slice(-4)}`;

  const requestBody = buildCreateRequestBody(payload);

  try {
    const { data } = await httpClient.post<MerchantAnnouncementCreateResponse>(
      '/announcements',
      requestBody,
    );
    return mapCreateResponse(data ?? {}, fallbackReference, payload.status);
  } catch (error) {
    console.error('Failed to create merchant announcement', error);
    throw new Error("Impossible de créer l'annonce commerçant");
  }
};

export const fetchMerchantAnnouncements = async (): Promise<MerchantAnnouncement[]> => {
  try {
    const { data } = await httpClient.get<
      PaginatedResponse<MerchantAnnouncementResponse> | MerchantAnnouncementResponse[]
    >('/announcements', {
      params: { mine: true, page: 0, size: 50, sort: 'updatedAt,desc' },
    });
    return extractAnnouncementData(data).map(mapAnnouncement);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    console.error('Failed to fetch merchant announcements', error);
    throw new Error('Impossible de récupérer les annonces commerçant');
  }
};
