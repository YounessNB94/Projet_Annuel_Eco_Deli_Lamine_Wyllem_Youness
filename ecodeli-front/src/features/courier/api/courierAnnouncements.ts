import type { AnnouncementStatus } from '../../client/api/clientAnnouncements';

export interface CourierAvailableAnnouncement {
  id: string;
  title: string;
  type: string;
  origin: string;
  destination: string;
  pickupWindow: string;
  deliveryWindow: string;
  distanceKm: number;
  budget: number;
  carbonSavingKg: number;
  clientName: string;
  clientRating: number;
  equipment?: string[];
  status: AnnouncementStatus;
}

const MOCK_COURIER_ANNOUNCEMENTS: CourierAvailableAnnouncement[] = [
  {
    id: 'ANN-010',
    title: 'Documents urgents Paris → Reims',
    type: 'Document',
    origin: 'Paris 75010',
    destination: 'Reims 51100',
    pickupWindow: 'Aujourd\'hui • 13:00 - 14:00',
    deliveryWindow: 'Aujourd\'hui • 16:00 - 18:00',
    distanceKm: 145,
    budget: 65,
    carbonSavingKg: 4.2,
    clientName: 'Atelier Girard',
    clientRating: 4.9,
    status: 'PUBLISHED',
  },
  {
    id: 'ANN-011',
    title: 'Électronique Lyon → Grenoble',
    type: 'Petite livraison',
    origin: 'Lyon 69002',
    destination: 'Grenoble 38000',
    pickupWindow: 'Demain • 08:00 - 10:00',
    deliveryWindow: 'Demain • 13:00 - 15:00',
    distanceKm: 115,
    budget: 90,
    carbonSavingKg: 5.8,
    clientName: 'Tech&Co',
    clientRating: 4.7,
    equipment: ['Cartons renforcés'],
    status: 'PUBLISHED',
  },
  {
    id: 'ANN-012',
    title: 'Palette Bordeaux → Nantes',
    type: 'Palette',
    origin: 'Bordeaux 33000',
    destination: 'Nantes 44000',
    pickupWindow: '15 Dec • 07:30 - 09:00',
    deliveryWindow: '15 Dec • 17:00 - 19:00',
    distanceKm: 347,
    budget: 210,
    carbonSavingKg: 16.5,
    clientName: 'Atelier du Bois',
    clientRating: 4.8,
    equipment: ['Transpalette'],
    status: 'PUBLISHED',
  },
  {
    id: 'ANN-013',
    title: 'Échantillons Lille → Bruxelles',
    type: 'Document',
    origin: 'Lille 59800',
    destination: 'Bruxelles 1000',
    pickupWindow: 'Aujourd\'hui • 11:00 - 12:00',
    deliveryWindow: 'Aujourd\'hui • 15:00 - 16:00',
    distanceKm: 112,
    budget: 80,
    carbonSavingKg: 3.5,
    clientName: 'Laboratoire Nord',
    clientRating: 4.6,
    status: 'ASSIGNED',
  },
];

const delay = (min = 200, max = 600) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

export const fetchCourierAvailableAnnouncements = async (): Promise<CourierAvailableAnnouncement[]> => {
  await delay();
  return MOCK_COURIER_ANNOUNCEMENTS.filter((announcement) => announcement.status === 'PUBLISHED');
};

export interface CourierAssignmentResult {
  announcementId: string;
  assignmentId: string;
  assignedAt: string;
  pickupEta: string;
  message: string;
}

export const takeOverCourierAnnouncement = async (
  announcementId: string,
): Promise<CourierAssignmentResult> => {
  await delay();
  const announcement = MOCK_COURIER_ANNOUNCEMENTS.find((item) => item.id === announcementId);

  if (!announcement) {
    throw new Error("Annonce introuvable");
  }

  if (announcement.status !== 'PUBLISHED') {
    throw new Error("Cette annonce n'est plus disponible");
  }

  return {
    announcementId,
    assignmentId: `ASSIGN-${Math.floor(Math.random() * 10000)}`,
    assignedAt: new Date().toLocaleString('fr-FR'),
    pickupEta: announcement.pickupWindow,
    message: 'Vous avez pris en charge cette annonce. Le client a été notifié.',
  };
};
