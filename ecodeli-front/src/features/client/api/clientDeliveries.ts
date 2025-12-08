// src/features/client/api/clientDeliveries.ts

// Si tu as déjà un httpClient, garde cet import, sinon commente-le pour l'instant
// import { httpClient } from '../../../shared/api/httpClient';

export type DeliveryStatus = 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED';

export interface Delivery {
  id: string;
  origin: string;
  destination: string;
  courierName: string;
  date: string;          
  estimatedTime: string; 
  price: number;
  status: DeliveryStatus;
}

const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 'DLV-001',
    origin: 'Paris 75001',
    destination: 'Lyon 69001',
    courierName: 'Marie Lambert',
    date: '2025-12-15',
    estimatedTime: '2h 30min',
    price: 25,
    status: 'IN_TRANSIT',
  },
  {
    id: 'DLV-002',
    origin: 'Bordeaux 33000',
    destination: 'Rennes 35000',
    courierName: 'Thomas Martin',
    date: '2025-12-15',
    estimatedTime: '5h 15min',
    price: 30,
    status: 'PICKED_UP',
  },
  {
    id: 'DLV-003',
    origin: 'Marseille 13001',
    destination: 'Toulouse 31000',
    courierName: 'Sophie Dubois',
    date: '2025-12-10',
    estimatedTime: 'Livré',
    price: 15,
    status: 'DELIVERED',
  },
  {
    id: 'DLV-004',
    origin: 'Lille 59000',
    destination: 'Nantes 44000',
    courierName: 'Pierre Bernard',
    date: '2025-12-20',
    estimatedTime: 'En attente',
    price: 85,
    status: 'ACCEPTED',
  },
];

export const fetchClientDeliveries = async (): Promise<Delivery[]> => {
  return Promise.resolve(MOCK_DELIVERIES);

  // TODO Version API réelle plus tard :
  // const { data } = await httpClient.get<Delivery[]>('/deliveries?assignedTo=me');
  // return data;
};
