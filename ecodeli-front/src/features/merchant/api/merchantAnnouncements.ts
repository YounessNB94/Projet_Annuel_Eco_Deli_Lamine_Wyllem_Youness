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

const MOCK_MERCHANT_ANNOUNCEMENTS: MerchantAnnouncement[] = [
  {
    id: 'MHD-001',
    campaignName: 'Opération Noël — Paris 15',
    reference: 'XMAS-P15',
    serviceLevel: 'EXPRESS',
    status: 'PUBLISHED',
    pickupWindow: {
      date: '2025-12-12',
      start: '07:00',
      end: '08:00',
    },
    deliveryWindow: {
      date: '2025-12-12',
      start: '09:00',
      end: '14:00',
    },
    deliveryCity: 'Paris',
    deliveryRadiusKm: 8,
    packagesCount: 120,
    averageWeight: 4,
    budget: 1450,
    updatedAt: '2025-12-09T08:15:00Z',
  },
  {
    id: 'MHD-002',
    campaignName: 'Outlet ménager Lyon',
    reference: 'OUT-LYO',
    serviceLevel: 'STANDARD',
    status: 'DRAFT',
    pickupWindow: {
      date: '2025-12-15',
      start: '06:30',
      end: '07:30',
    },
    deliveryWindow: {
      date: '2025-12-15',
      start: '10:00',
      end: '16:00',
    },
    deliveryCity: 'Lyon',
    deliveryRadiusKm: 20,
    packagesCount: 80,
    averageWeight: 7,
    budget: 980,
    updatedAt: '2025-12-08T16:40:00Z',
  },
  {
    id: 'MHD-003',
    campaignName: 'Click & Collect Bordeaux',
    reference: 'CAC-BDX',
    serviceLevel: 'STANDARD',
    status: 'PUBLISHED',
    pickupWindow: {
      date: '2025-12-10',
      start: '05:30',
      end: '06:30',
    },
    deliveryWindow: {
      date: '2025-12-10',
      start: '09:30',
      end: '18:00',
    },
    deliveryCity: 'Bordeaux',
    deliveryRadiusKm: 15,
    packagesCount: 65,
    averageWeight: 3,
    budget: 720,
    updatedAt: '2025-12-09T10:02:00Z',
  },
];

export const createMerchantHomeDeliveryAnnouncement = async (
  payload: MerchantHomeDeliveryAnnouncementPayload,
): Promise<MerchantHomeDeliveryAnnouncementResponse> => {
  const now = new Date();
  const fallbackRef = `MHD-${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${now.getTime().toString().slice(-4)}`;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: fallbackRef,
        reference: payload.values.reference || fallbackRef,
        status: payload.status,
        publishedAt: payload.status === 'PUBLISHED' ? now.toISOString() : undefined,
      });
    }, 800);
  });
};

export const fetchMerchantAnnouncements = async (): Promise<MerchantAnnouncement[]> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_MERCHANT_ANNOUNCEMENTS), 400);
  });
