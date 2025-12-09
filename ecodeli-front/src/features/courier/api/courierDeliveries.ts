export type CourierDeliveryStatus =
  | 'ACCEPTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED';

export interface CourierDelivery {
  id: string;
  title: string;
  clientName: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupWindow: string;
  dropoffWindow: string;
  distanceKm: number;
  earnings: number;
  status: CourierDeliveryStatus;
  vehicleType: string;
  assignmentDate: string;
  notes?: string;
}

const MOCK_COURIER_DELIVERIES: CourierDelivery[] = [
  {
    id: 'DLV-201',
    title: 'Pharmacie Paris → Antony',
    clientName: 'Pharma Lyonnais',
    pickupAddress: '18 Rue Oberkampf, 75011 Paris',
    dropoffAddress: '42 Avenue de la Division Leclerc, 92160 Antony',
    pickupWindow: 'Aujourd\'hui • 14:00 - 15:00',
    dropoffWindow: 'Aujourd\'hui • 16:00 - 17:30',
    distanceKm: 18,
    earnings: 38,
    status: 'IN_TRANSIT',
    vehicleType: 'Velo cargo',
    assignmentDate: '8 Dec 2025, 11:45',
    notes: 'Contient produits sensibles, rester a l\'ombre.',
  },
  {
    id: 'DLV-202',
    title: 'Samples laboratoire',
    clientName: 'Laboratoire Nord',
    pickupAddress: '5 Rue Nationale, 59000 Lille',
    dropoffAddress: '12 Rue des Arts, 59800 Lille',
    pickupWindow: 'Aujourd\'hui • 17:00 - 17:30',
    dropoffWindow: 'Aujourd\'hui • 18:00 - 18:30',
    distanceKm: 6,
    earnings: 24,
    status: 'ACCEPTED',
    vehicleType: 'Velo',
    assignmentDate: '8 Dec 2025, 09:20',
  },
  {
    id: 'DLV-203',
    title: 'Palette eco meubles',
    clientName: 'Atelier du Bois',
    pickupAddress: 'Zone artisanale, 33000 Bordeaux',
    dropoffAddress: 'Entrepot EcoDeli, 44000 Nantes',
    pickupWindow: 'Demain • 07:30 - 09:00',
    dropoffWindow: 'Demain • 19:00 - 21:00',
    distanceKm: 347,
    earnings: 230,
    status: 'ACCEPTED',
    vehicleType: 'Utilitaire',
    assignmentDate: '7 Dec 2025, 18:05',
    notes: 'Prevoir sangles et couverture.',
  },
  {
    id: 'DLV-204',
    title: 'Mode eco Paris → Reims',
    clientName: 'Maison Mireille',
    pickupAddress: '21 Rue du Faubourg Saint-Denis, 75010 Paris',
    dropoffAddress: '8 Rue de Vesle, 51100 Reims',
    pickupWindow: 'Hier • 11:00 - 12:00',
    dropoffWindow: 'Hier • 16:00 - 18:00',
    distanceKm: 145,
    earnings: 95,
    status: 'DELIVERED',
    vehicleType: 'Voiture electrique',
    assignmentDate: '6 Dec 2025, 10:10',
  },
];

const delay = (min = 200, max = 600) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

export const fetchCourierDeliveries = async (): Promise<CourierDelivery[]> => {
  await delay();
  return MOCK_COURIER_DELIVERIES.map((delivery) => ({ ...delivery }));
};

export interface CourierDeliveryContact {
  name: string;
  phone: string;
}

export interface CourierDeliveryTimelineItem {
  status: CourierDeliveryStatus;
  label: string;
  dateLabel: string;
  completed: boolean;
  current?: boolean;
}

export interface CourierDeliveryDetail extends CourierDelivery {
  pickupContact: CourierDeliveryContact;
  dropoffContact: CourierDeliveryContact;
  packageType: string;
  weight: string;
  instructions?: string;
  timeline: CourierDeliveryTimelineItem[];
}

const STATUS_FLOW: CourierDeliveryStatus[] = ['ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

const syncTimelineWithStatus = (
  timeline: CourierDeliveryTimelineItem[],
  currentStatus: CourierDeliveryStatus,
) => {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  return timeline.map((step) => {
    const stepIndex = STATUS_FLOW.indexOf(step.status);
    if (stepIndex === -1) {
      return step;
    }
    return {
      ...step,
      completed: stepIndex <= currentIndex,
      current: stepIndex === currentIndex,
    };
  });
};

const MOCK_COURIER_DELIVERY_DETAILS: Record<string, CourierDeliveryDetail> = {
  'DLV-201': {
    id: 'DLV-201',
    title: 'Pharmacie Paris → Antony',
    clientName: 'Pharma Lyonnais',
    pickupAddress: '18 Rue Oberkampf, 75011 Paris',
    dropoffAddress: '42 Avenue de la Division Leclerc, 92160 Antony',
    pickupWindow: 'Aujourd\'hui • 14:00 - 15:00',
    dropoffWindow: 'Aujourd\'hui • 16:00 - 17:30',
    distanceKm: 18,
    earnings: 38,
    status: 'IN_TRANSIT',
    vehicleType: 'Velo cargo',
    assignmentDate: '8 Dec 2025, 11:45',
    notes: 'Contient produits sensibles, rester a l\'ombre.',
    pickupContact: {
      name: 'Jean Dupont',
      phone: '+33 6 12 34 56 78',
    },
    dropoffContact: {
      name: 'Sophie Martin',
      phone: '+33 6 84 32 18 90',
    },
    packageType: 'Colis medical',
    weight: '8 kg',
    timeline: syncTimelineWithStatus(
      [
        {
          status: 'ACCEPTED',
          label: 'Mission acceptee',
          dateLabel: '8 Dec 2025, 11:45',
          completed: true,
        },
        {
          status: 'PICKED_UP',
          label: 'Colis collecte',
          dateLabel: 'Aujourd\'hui • 14:10',
          completed: true,
        },
        {
          status: 'IN_TRANSIT',
          label: 'En cours de livraison',
          dateLabel: 'Aujourd\'hui • 14:30',
          completed: true,
        },
        {
          status: 'DELIVERED',
          label: 'Livraison effectuee',
          dateLabel: 'Estimee Aujourd\'hui • 17:00',
          completed: false,
        },
      ],
      'IN_TRANSIT',
    ),
  },
  'DLV-202': {
    id: 'DLV-202',
    title: 'Samples laboratoire',
    clientName: 'Laboratoire Nord',
    pickupAddress: '5 Rue Nationale, 59000 Lille',
    dropoffAddress: '12 Rue des Arts, 59800 Lille',
    pickupWindow: 'Aujourd\'hui • 17:00 - 17:30',
    dropoffWindow: 'Aujourd\'hui • 18:00 - 18:30',
    distanceKm: 6,
    earnings: 24,
    status: 'ACCEPTED',
    vehicleType: 'Velo',
    assignmentDate: '8 Dec 2025, 09:20',
    pickupContact: {
      name: 'Claire Robert',
      phone: '+33 6 70 12 45 67',
    },
    dropoffContact: {
      name: 'Dr Etienne',
      phone: '+33 6 70 88 12 34',
    },
    packageType: 'Petits echantillons',
    weight: '2 kg',
    instructions: 'Transporter dans le sac isotherme.',
    timeline: syncTimelineWithStatus(
      [
        {
          status: 'ACCEPTED',
          label: 'Mission acceptee',
          dateLabel: '8 Dec 2025, 09:20',
          completed: true,
        },
        {
          status: 'PICKED_UP',
          label: 'Colis collecte',
          dateLabel: 'Prevue Aujourd\'hui • 17:00',
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
          label: 'Livraison effectuee',
          dateLabel: 'Estimee Aujourd\'hui • 18:15',
          completed: false,
        },
      ],
      'ACCEPTED',
    ),
  },
  'DLV-203': {
    id: 'DLV-203',
    title: 'Palette eco meubles',
    clientName: 'Atelier du Bois',
    pickupAddress: 'Zone artisanale, 33000 Bordeaux',
    dropoffAddress: 'Entrepot EcoDeli, 44000 Nantes',
    pickupWindow: 'Demain • 07:30 - 09:00',
    dropoffWindow: 'Demain • 19:00 - 21:00',
    distanceKm: 347,
    earnings: 230,
    status: 'ACCEPTED',
    vehicleType: 'Utilitaire',
    assignmentDate: '7 Dec 2025, 18:05',
    notes: 'Prevoir sangles et couverture.',
    pickupContact: {
      name: 'Luc Moreau',
      phone: '+33 6 50 45 12 12',
    },
    dropoffContact: {
      name: 'Equipe EcoDeli',
      phone: '+33 6 81 18 81 18',
    },
    packageType: 'Palette bois',
    weight: '220 kg',
    timeline: syncTimelineWithStatus(
      [
        {
          status: 'ACCEPTED',
          label: 'Mission acceptee',
          dateLabel: '7 Dec 2025, 18:05',
          completed: true,
        },
        {
          status: 'PICKED_UP',
          label: 'Collecte prevue',
          dateLabel: 'Demain • 07:30',
          completed: false,
        },
        {
          status: 'IN_TRANSIT',
          label: 'En cours de livraison',
          dateLabel: 'Demain • 11:00',
          completed: false,
        },
        {
          status: 'DELIVERED',
          label: 'Livraison effectuee',
          dateLabel: 'Demain • 20:00',
          completed: false,
        },
      ],
      'ACCEPTED',
    ),
  },
  'DLV-204': {
    id: 'DLV-204',
    title: 'Mode eco Paris → Reims',
    clientName: 'Maison Mireille',
    pickupAddress: '21 Rue du Faubourg Saint-Denis, 75010 Paris',
    dropoffAddress: '8 Rue de Vesle, 51100 Reims',
    pickupWindow: 'Hier • 11:00 - 12:00',
    dropoffWindow: 'Hier • 16:00 - 18:00',
    distanceKm: 145,
    earnings: 95,
    status: 'DELIVERED',
    vehicleType: 'Voiture electrique',
    assignmentDate: '6 Dec 2025, 10:10',
    pickupContact: {
      name: 'Helene Girard',
      phone: '+33 6 91 33 45 21',
    },
    dropoffContact: {
      name: 'Boutique Mireille',
      phone: '+33 6 01 45 22 11',
    },
    packageType: 'Cartons textiles',
    weight: '35 kg',
    timeline: syncTimelineWithStatus(
      [
        {
          status: 'ACCEPTED',
          label: 'Mission acceptee',
          dateLabel: '6 Dec 2025, 10:10',
          completed: true,
        },
        {
          status: 'PICKED_UP',
          label: 'Colis collecte',
          dateLabel: '7 Dec 2025, 11:05',
          completed: true,
        },
        {
          status: 'IN_TRANSIT',
          label: 'En cours de livraison',
          dateLabel: '7 Dec 2025, 12:00',
          completed: true,
        },
        {
          status: 'DELIVERED',
          label: 'Livraison effectuee',
          dateLabel: '7 Dec 2025, 16:20',
          completed: true,
        },
      ],
      'DELIVERED',
    ),
  },
};

export const fetchCourierDeliveryDetail = async (
  deliveryId: string,
): Promise<CourierDeliveryDetail> => {
  await delay();
  const detail = MOCK_COURIER_DELIVERY_DETAILS[deliveryId];
  if (!detail) {
    throw new Error('Livraison introuvable');
  }
  return { ...detail };
};

export const advanceCourierDeliveryStatus = async (
  deliveryId: string,
): Promise<CourierDeliveryDetail> => {
  await delay();
  const detail = MOCK_COURIER_DELIVERY_DETAILS[deliveryId];
  if (!detail) {
    throw new Error('Livraison introuvable');
  }

  const currentIndex = STATUS_FLOW.indexOf(detail.status);
  if (currentIndex === -1) {
    throw new Error('Statut inconnu');
  }

  if (currentIndex === STATUS_FLOW.length - 1) {
    return { ...detail };
  }

  const nextStatus = STATUS_FLOW[currentIndex + 1];
  detail.status = nextStatus;
  detail.timeline = syncTimelineWithStatus(detail.timeline, nextStatus);

  const delivery = MOCK_COURIER_DELIVERIES.find((item) => item.id === deliveryId);
  if (delivery) {
    delivery.status = nextStatus;
  }

  return { ...detail };
};
