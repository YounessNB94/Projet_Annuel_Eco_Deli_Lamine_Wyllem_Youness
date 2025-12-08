import type { AnnouncementStatus } from './clientAnnouncements';

export type AnnouncementTimelineStatus =
  | 'CREATED'
  | 'PUBLISHED'
  | 'ASSIGNED'
  | 'PICKUP_SCHEDULED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export interface AnnouncementTimelineItem {
  status: AnnouncementTimelineStatus;
  label: string;
  dateLabel: string;
  completed: boolean;
  driver?: string;
}

export interface AnnouncementDriverSummary {
  name: string;
  rating: number;
  deliveries: number;
  phone?: string;
  email?: string;
}

export interface AnnouncementDetail {
  id: string;
  title: string;
  status: AnnouncementStatus;
  type: string;
  createdAt: string;
  fromAddress: string;
  toAddress: string;
  pickupDate: string;
  pickupTime: string;
  deliveryDate?: string;
  deliveryTime?: string;
  budget: number;
  description?: string;
  driver?: AnnouncementDriverSummary;
  deliveryId?: string;
  timeline: AnnouncementTimelineItem[];
}

const MOCK_DETAILS: Record<string, AnnouncementDetail> = {
  'ANN-001': {
    id: 'ANN-001',
    title: 'Colis Paris → Lyon',
    status: 'ASSIGNED',
    type: 'Petite livraison',
    createdAt: '1 Dec 2025, 14:30',
    fromAddress: '123 Rue de la Paix, 75001 Paris',
    toAddress: '456 Avenue des Champs, 69001 Lyon',
    pickupDate: '15 Dec 2025',
    pickupTime: '09:00 - 12:00',
    deliveryDate: '15 Dec 2025',
    deliveryTime: '14:00 - 18:00',
    budget: 25,
    description:
      'Petit colis fragile contenant de la vaisselle. Merci de manipuler avec précaution.',
    driver: {
      name: 'Marie Lambert',
      rating: 4.8,
      deliveries: 156,
      phone: '+33 6 11 22 33 44',
      email: 'marie.lambert@ecodeli.fr',
    },
    deliveryId: 'DLV-001',
    timeline: [
      {
        status: 'CREATED',
        label: 'Annonce créée',
        dateLabel: '1 Dec 2025, 14:30',
        completed: true,
      },
      {
        status: 'PUBLISHED',
        label: 'Annonce publiée',
        dateLabel: '1 Dec 2025, 14:35',
        completed: true,
      },
      {
        status: 'ASSIGNED',
        label: 'Livreur assigné',
        dateLabel: '2 Dec 2025, 09:15',
        completed: true,
        driver: 'Marie Lambert',
      },
      {
        status: 'PICKUP_SCHEDULED',
        label: 'Collecte planifiée',
        dateLabel: '15 Dec 2025, 09:00 - 12:00',
        completed: false,
      },
      {
        status: 'IN_TRANSIT',
        label: 'En cours de livraison',
        dateLabel: 'À venir',
        completed: false,
      },
      {
        status: 'DELIVERED',
        label: 'Livraison effectuée',
        dateLabel: 'À venir',
        completed: false,
      },
    ],
  },
  'ANN-002': {
    id: 'ANN-002',
    title: 'Documents Marseille → Toulouse',
    status: 'ASSIGNED',
    type: 'Document',
    createdAt: '28 Nov 2025, 09:10',
    fromAddress: '27 Rue Saint-Ferréol, 13001 Marseille',
    toAddress: '5 Place du Capitole, 31000 Toulouse',
    pickupDate: '10 Dec 2025',
    pickupTime: '08:00 - 10:00',
    deliveryDate: '10 Dec 2025',
    deliveryTime: '13:00 - 16:00',
    budget: 15,
    description: 'Documents confidentiels, transport sécurisé requis.',
    driver: {
      name: 'Sophie Dubois',
      rating: 4.9,
      deliveries: 312,
    },
    deliveryId: 'DLV-003',
    timeline: [
      {
        status: 'CREATED',
        label: 'Annonce créée',
        dateLabel: '28 Nov 2025, 09:10',
        completed: true,
      },
      {
        status: 'PUBLISHED',
        label: 'Annonce publiée',
        dateLabel: '28 Nov 2025, 09:15',
        completed: true,
      },
      {
        status: 'ASSIGNED',
        label: 'Livreur assigné',
        dateLabel: '30 Nov 2025, 11:45',
        completed: true,
        driver: 'Sophie Dubois',
      },
      {
        status: 'PICKUP_SCHEDULED',
        label: 'Collecte planifiée',
        dateLabel: '10 Dec 2025, 08:00 - 10:00',
        completed: false,
      },
      {
        status: 'IN_TRANSIT',
        label: 'En cours de livraison',
        dateLabel: 'À venir',
        completed: false,
      },
      {
        status: 'DELIVERED',
        label: 'Livraison effectuée',
        dateLabel: 'À venir',
        completed: false,
      },
    ],
  },
  'ANN-003': {
    id: 'ANN-003',
    title: 'Palette Lille → Nantes',
    status: 'DRAFT',
    type: 'Grande livraison',
    createdAt: '5 Dec 2025, 08:20',
    fromAddress: '90 Rue Nationale, 59000 Lille',
    toAddress: '30 Quai de la Fosse, 44000 Nantes',
    pickupDate: '20 Dec 2025',
    pickupTime: '07:45 - 10:45',
    budget: 85,
    description:
      'Palette de pièces automobiles. Prévoir transpalette pour le chargement.',
    timeline: [
      {
        status: 'CREATED',
        label: 'Annonce créée',
        dateLabel: '5 Dec 2025, 08:20',
        completed: true,
      },
      {
        status: 'PUBLISHED',
        label: 'Annonce publiée',
        dateLabel: 'À publier',
        completed: false,
      },
      {
        status: 'ASSIGNED',
        label: 'Livreur assigné',
        dateLabel: 'En attente',
        completed: false,
      },
      {
        status: 'PICKUP_SCHEDULED',
        label: 'Collecte planifiée',
        dateLabel: '20 Dec 2025, 07:45 - 10:45',
        completed: false,
      },
      {
        status: 'IN_TRANSIT',
        label: 'En cours de livraison',
        dateLabel: 'À venir',
        completed: false,
      },
      {
        status: 'DELIVERED',
        label: 'Livraison effectuée',
        dateLabel: 'À venir',
        completed: false,
      },
    ],
  },
};

export const fetchClientAnnouncementDetail = async (
  announcementId: string,
): Promise<AnnouncementDetail> => {
  const detail = MOCK_DETAILS[announcementId];
  if (!detail) {
    throw new Error('Annonce introuvable');
  }
  return detail;
};
