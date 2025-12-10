export type ClientPaymentStatus = 'due' | 'processing' | 'paid' | 'failed';

export interface ClientPayment {
  id: string;
  reference: string;
  deliveryTitle: string;
  amount: number;
  dueDate: string;
  status: ClientPaymentStatus;
}

export interface ClientPaymentDetail extends ClientPayment {
  serviceFee: number;
  total: number;
}

const MOCK_CLIENT_PAYMENTS: ClientPaymentDetail[] = [
  {
    id: 'PAY-2025-001',
    reference: 'INV-2025-781',
    deliveryTitle: 'Livraison Paris -> Lyon',
    amount: 25,
    serviceFee: 0,
    total: 25,
    dueDate: '2025-12-08',
    status: 'due',
  },
  {
    id: 'PAY-2025-002',
    reference: 'INV-2025-779',
    deliveryTitle: 'Livraison Lille -> Paris',
    amount: 18,
    serviceFee: 1.8,
    total: 19.8,
    dueDate: '2025-12-12',
    status: 'processing',
  },
  {
    id: 'PAY-2025-003',
    reference: 'INV-2025-753',
    deliveryTitle: 'Livraison Marseille -> Toulouse',
    amount: 32,
    serviceFee: 2.5,
    total: 34.5,
    dueDate: '2025-11-30',
    status: 'paid',
  },
  {
    id: 'PAY-2025-004',
    reference: 'INV-2025-741',
    deliveryTitle: 'Livraison Lille -> Nantes',
    amount: 42,
    serviceFee: 3.2,
    total: 45.2,
    dueDate: '2025-11-18',
    status: 'failed',
  },
];

export const fetchClientPayments = async (): Promise<ClientPayment[]> =>
  Promise.resolve(MOCK_CLIENT_PAYMENTS.map(({ serviceFee, total, ...rest }) => rest));

export const fetchClientPaymentDetail = async (paymentId: string): Promise<ClientPaymentDetail | null> =>
  Promise.resolve(MOCK_CLIENT_PAYMENTS.find((payment) => payment.id === paymentId) ?? null);
