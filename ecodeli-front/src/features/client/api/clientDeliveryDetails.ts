import type { DeliveryStatus } from './clientDeliveries';

export interface DeliveryTimelineItem {
  status: DeliveryStatus;
  label: string;
  dateLabel: string;
  completed: boolean;
  current?: boolean;
}

export interface DeliveryContactPoint {
  address: string;
  contactName: string;
  phone: string;
}

export interface DeliveryProofs {
  pickup: boolean;
  delivery: boolean;
}

export interface DeliveryDriver {
  name: string;
  phone: string;
  email: string;
  rating: number;
  totalDeliveries: number;
  vehicle: string;
}

export interface DeliveryPrice {
  total: number;
  base: number;
  serviceFees: number;
}

export interface DeliveryDetail {
  id: string;
  status: DeliveryStatus;
  title: string;      
  typeLabel: string;  

  pickupTimeLabel: string;         
  estimatedDeliveryLabel: string;
  actualDeliveryLabel?: string | null;

  from: DeliveryContactPoint;
  to: DeliveryContactPoint;

  driver: DeliveryDriver;
  price: DeliveryPrice;
  proofs: DeliveryProofs;
  timeline: DeliveryTimelineItem[];
}

const MOCK_DETAILS: Record<string, DeliveryDetail> = {
  'DLV-001': {
    id: 'DLV-001',
    status: 'IN_TRANSIT',
    title: 'Colis Paris → Lyon',
    typeLabel: 'Petite livraison',
    pickupTimeLabel: '15 Dec 2025, 10:30',
    estimatedDeliveryLabel: '15 Dec 2025, 16:00',
    actualDeliveryLabel: null,
    from: {
      address: '123 Rue de la Paix, 75001 Paris',
      contactName: 'Jean Dupont',
      phone: '+33 6 12 34 56 78',
    },
    to: {
      address: '456 Avenue des Champs, 69001 Lyon',
      contactName: 'Sophie Martin',
      phone: '+33 6 98 76 54 32',
    },
    driver: {
      name: 'Marie Lambert',
      phone: '+33 6 11 22 33 44',
      email: 'marie.lambert@ecodeli.fr',
      rating: 4.8,
      totalDeliveries: 156,
      vehicle: 'Renault Kangoo - AB-123-CD',
    },
    price: {
      total: 25,
      base: 25,
      serviceFees: 0,
    },
    proofs: {
      pickup: true,
      delivery: false,
    },
    timeline: [
      {
        status: 'ACCEPTED',
        label: 'Livraison acceptée',
        dateLabel: '2 Dec 2025, 09:15',
        completed: true,
      },
      {
        status: 'PICKED_UP',
        label: 'Colis collecté',
        dateLabel: '15 Dec 2025, 10:30',
        completed: true,
      },
      {
        status: 'IN_TRANSIT',
        label: 'En cours de livraison',
        dateLabel: '15 Dec 2025, 11:00',
        completed: true,
        current: true,
      },
      {
        status: 'DELIVERED',
        label: 'Livraison effectuée',
        dateLabel: 'Estimation: 15 Dec 2025, 16:00',
        completed: false,
      },
    ],
  },
  'DLV-002': {
    id: 'DLV-002',
    status: 'PICKED_UP',
    title: 'Palette Bordeaux → Rennes',
    typeLabel: 'Grande livraison',
    pickupTimeLabel: '15 Dec 2025, 08:00',
    estimatedDeliveryLabel: '15 Dec 2025, 18:00',
    actualDeliveryLabel: null,
    from: {
      address: '78 Quai des Chartrons, 33000 Bordeaux',
      contactName: 'Luc Moreau',
      phone: '+33 6 00 11 22 33',
    },
    to: {
      address: '12 Boulevard de la Liberté, 35000 Rennes',
      contactName: 'Camille Le Goff',
      phone: '+33 6 44 55 66 77',
    },
    driver: {
      name: 'Thomas Martin',
      phone: '+33 6 45 67 89 01',
      email: 'thomas.martin@ecodeli.fr',
      rating: 4.6,
      totalDeliveries: 204,
      vehicle: 'Mercedes Sprinter - CD-456-EF',
    },
    price: {
      total: 30,
      base: 28,
      serviceFees: 2,
    },
    proofs: {
      pickup: true,
      delivery: false,
    },
    timeline: [
      {
        status: 'ACCEPTED',
        label: 'Livraison acceptée',
        dateLabel: '10 Dec 2025, 14:05',
        completed: true,
      },
      {
        status: 'PICKED_UP',
        label: 'Colis collecté',
        dateLabel: '15 Dec 2025, 08:00',
        completed: true,
        current: true,
      },
      {
        status: 'IN_TRANSIT',
        label: 'En cours de livraison',
        dateLabel: 'En attente de départ',
        completed: false,
      },
      {
        status: 'DELIVERED',
        label: 'Livraison effectuée',
        dateLabel: 'Estimation: 15 Dec 2025, 18:00',
        completed: false,
      },
    ],
  },
  'DLV-003': {
    id: 'DLV-003',
    status: 'DELIVERED',
    title: 'Documents Marseille → Toulouse',
    typeLabel: 'Document',
    pickupTimeLabel: '10 Dec 2025, 09:15',
    estimatedDeliveryLabel: '10 Dec 2025, 12:40',
    actualDeliveryLabel: '10 Dec 2025, 12:32',
    from: {
      address: '14 Rue du Panier, 13002 Marseille',
      contactName: 'Isabelle Caron',
      phone: '+33 6 22 33 44 55',
    },
    to: {
      address: '5 Place du Capitole, 31000 Toulouse',
      contactName: 'Paul Lefèvre',
      phone: '+33 6 77 88 99 00',
    },
    driver: {
      name: 'Sophie Dubois',
      phone: '+33 6 55 44 33 22',
      email: 'sophie.dubois@ecodeli.fr',
      rating: 4.9,
      totalDeliveries: 312,
      vehicle: 'Peugeot Expert - GH-789-IJ',
    },
    price: {
      total: 15,
      base: 13,
      serviceFees: 2,
    },
    proofs: {
      pickup: true,
      delivery: true,
    },
    timeline: [
      {
        status: 'ACCEPTED',
        label: 'Livraison acceptée',
        dateLabel: '8 Dec 2025, 16:20',
        completed: true,
      },
      {
        status: 'PICKED_UP',
        label: 'Colis collecté',
        dateLabel: '10 Dec 2025, 09:15',
        completed: true,
      },
      {
        status: 'IN_TRANSIT',
        label: 'En cours de livraison',
        dateLabel: '10 Dec 2025, 10:00',
        completed: true,
      },
      {
        status: 'DELIVERED',
        label: 'Livraison effectuée',
        dateLabel: 'Livré le 10 Dec 2025, 12:32',
        completed: true,
        current: true,
      },
    ],
  },
  'DLV-004': {
    id: 'DLV-004',
    status: 'ACCEPTED',
    title: 'Colis Lille → Nantes',
    typeLabel: 'Livraison standard',
    pickupTimeLabel: '20 Dec 2025, 07:45',
    estimatedDeliveryLabel: '20 Dec 2025, 14:30',
    actualDeliveryLabel: null,
    from: {
      address: '90 Rue Nationale, 59000 Lille',
      contactName: 'Adrien Petit',
      phone: '+33 6 88 77 66 55',
    },
    to: {
      address: '30 Quai de la Fosse, 44000 Nantes',
      contactName: 'Claire Roux',
      phone: '+33 6 33 22 11 00',
    },
    driver: {
      name: 'Pierre Bernard',
      phone: '+33 6 99 88 77 66',
      email: 'pierre.bernard@ecodeli.fr',
      rating: 4.5,
      totalDeliveries: 98,
      vehicle: 'Citroën Jumpy - KL-012-MN',
    },
    price: {
      total: 85,
      base: 78,
      serviceFees: 7,
    },
    proofs: {
      pickup: false,
      delivery: false,
    },
    timeline: [
      {
        status: 'ACCEPTED',
        label: 'Livraison acceptée',
        dateLabel: '18 Dec 2025, 11:00',
        completed: true,
        current: true,
      },
      {
        status: 'PICKED_UP',
        label: 'Collecte planifiée',
        dateLabel: 'Prévue le 20 Dec 2025, 07:45',
        completed: false,
      },
      {
        status: 'IN_TRANSIT',
        label: 'En cours de livraison',
        dateLabel: 'En attente',
        completed: false,
      },
      {
        status: 'DELIVERED',
        label: 'Livraison effectuée',
        dateLabel: 'En attente',
        completed: false,
      },
    ],
  },
};

export const fetchClientDeliveryDetail = async (
  id: string,
): Promise<DeliveryDetail> => {
  // TODO: remplacer par GET /deliveries/{id}
  const detail = MOCK_DETAILS[id] ?? Object.values(MOCK_DETAILS)[0];
  return Promise.resolve(detail);
};
