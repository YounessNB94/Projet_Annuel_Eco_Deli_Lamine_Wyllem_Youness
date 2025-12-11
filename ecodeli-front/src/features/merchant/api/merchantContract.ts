import { isAxiosError } from 'axios';
import { httpClient } from '../../../shared/api/httpClient';
import type { PaginatedResponse } from '../../../shared/api/types';

export type MerchantContractStatus = 'DRAFT' | 'UNDER_REVIEW' | 'ACTIVE' | 'SUSPENDED';

export interface MerchantContractDocument {
  id: string;
  label: string;
  type: 'CONTRACT' | 'ANNEX' | 'POLICY';
  updatedAt: string;
  pdfUrl: string;
}

export interface MerchantContract {
  id: string;
  companyName: string;
  status: MerchantContractStatus;
  statusLabel: string;
  statusDescription: string;
  lastUpdate: string;
  pdfUrl: string;
  supportEmail: string;
  supportPhone: string;
  documents: MerchantContractDocument[];
}

interface MerchantContractDocumentResponse {
  id?: number | string;
  name?: string;
  label?: string;
  type?: string;
  category?: string;
  updatedAt?: string;
  updatedOn?: string;
  pdfUrl?: string;
  url?: string;
}

interface MerchantContractResponse {
  id?: number | string;
  companyName?: string;
  status?: string;
  statusLabel?: string;
  statusDescription?: string;
  lastUpdate?: string;
  updatedAt?: string;
  updatedOn?: string;
  pdfUrl?: string;
  contractUrl?: string;
  supportEmail?: string;
  supportEmailAddress?: string;
  supportPhone?: string;
  supportPhoneNumber?: string;
  documents?: MerchantContractDocumentResponse[];
}

const parseDate = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
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

const normalizeStatus = (status?: string): MerchantContractStatus => {
  switch (String(status ?? '').toUpperCase()) {
    case 'ACTIVE':
      return 'ACTIVE';
    case 'SUSPENDED':
      return 'SUSPENDED';
    case 'UNDER_REVIEW':
    case 'IN_REVIEW':
    case 'PENDING':
      return 'UNDER_REVIEW';
    case 'DRAFT':
    default:
      return 'DRAFT';
  }
};

const normalizeDocumentType = (
  type?: string,
): MerchantContractDocument['type'] => {
  switch (String(type ?? '').toUpperCase()) {
    case 'POLICY':
      return 'POLICY';
    case 'ANNEX':
    case 'ANNEXE':
    case 'ADDENDUM':
      return 'ANNEX';
    case 'CONTRACT':
    default:
      return 'CONTRACT';
  }
};

const mapContractDocument = (
  payload: MerchantContractDocumentResponse,
): MerchantContractDocument => ({
  id: String(payload.id ?? payload.label ?? `DOC-${Date.now()}`),
  label: payload.label ?? payload.name ?? 'Document contractuel',
  type: normalizeDocumentType(payload.type ?? payload.category),
  updatedAt:
    formatDateTime(payload.updatedAt ?? payload.updatedOn) || new Date().toISOString(),
  pdfUrl: payload.pdfUrl ?? payload.url ?? '#',
});

const mapContract = (payload: MerchantContractResponse): MerchantContract => ({
  id: String(payload.id ?? 'CONTRACT'),
  companyName: payload.companyName ?? 'Commerçant EcoDeli',
  status: normalizeStatus(payload.status),
  statusLabel: payload.statusLabel ?? 'Statut contrat',
  statusDescription:
    payload.statusDescription ??
    'Le statut du contrat est en cours de récupération. Merci de réessayer ultérieurement.',
  lastUpdate:
    formatDateTime(payload.lastUpdate ?? payload.updatedAt ?? payload.updatedOn) ||
    new Date().toISOString(),
  pdfUrl: payload.pdfUrl ?? payload.contractUrl ?? '#',
  supportEmail: payload.supportEmail ?? payload.supportEmailAddress ?? 'support@ecodeli.fr',
  supportPhone: payload.supportPhone ?? payload.supportPhoneNumber ?? '+33 1 23 45 67 89',
  documents: (payload.documents ?? []).map(mapContractDocument),
});

export const fetchMerchantContract = async (): Promise<MerchantContract> => {
  try {
    const { data } = await httpClient.get<
      PaginatedResponse<MerchantContractResponse> | MerchantContractResponse
    >(
      '/merchants/me/contracts',
      { params: { page: 0, size: 1, sort: 'updatedAt,desc' } },
    );

    if (Array.isArray((data as PaginatedResponse<MerchantContractResponse>).content)) {
      const paginated = data as PaginatedResponse<MerchantContractResponse>;
      const [latest] = paginated.content ?? [];
      if (latest) {
        return mapContract(latest);
      }
    }

    return mapContract(data as MerchantContractResponse);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Aucun contrat marchand trouvé');
    }
    console.error('Failed to fetch merchant contract', error);
    throw new Error('Impossible de récupérer le contrat commerçant');
  }
};
