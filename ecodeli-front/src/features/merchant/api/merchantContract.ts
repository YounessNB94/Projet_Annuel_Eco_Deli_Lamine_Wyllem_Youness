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

const MOCK_CONTRACT: MerchantContract = {
  id: 'CTR-78412',
  companyName: 'Maison Verte concept store',
  status: 'ACTIVE',
  statusLabel: 'Contrat actif',
  statusDescription: 'Votre contrat est signe et actif. Vous pouvez creer des annonces de livraison a tout moment.',
  lastUpdate: '09 Dec 2025, 10:42',
  pdfUrl: 'https://example.com/contracts/CTR-78412.pdf',
  supportEmail: 'merchant.support@ecodeli.fr',
  supportPhone: '+33 1 78 90 12 34',
  documents: [
    {
      id: 'DOC-1',
      label: 'Contrat principal EcoDeli',
      type: 'CONTRACT',
      updatedAt: '08 Dec 2025, 08:30',
      pdfUrl: 'https://example.com/contracts/CTR-78412.pdf',
    },
    {
      id: 'DOC-2',
      label: 'Annexe tarifaire 2025',
      type: 'ANNEX',
      updatedAt: '05 Dec 2025, 12:05',
      pdfUrl: 'https://example.com/contracts/CTR-78412-annex.pdf',
    },
  ],
};

const delay = (min = 150, max = 350) => new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

export const fetchMerchantContract = async (): Promise<MerchantContract> => {
  await delay();
  return { ...MOCK_CONTRACT };
};
