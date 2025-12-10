import type { ProviderAssignmentDetail } from '../types';

export const providerAssignmentsMock: ProviderAssignmentDetail[] = [
  {
    id: 'M-20251',
    title: 'Collecte hebdo BioMarche',
    clientName: 'BioMarche',
    scheduledAt: '11 dec. 08:30',
    location: 'Lyon 3e',
    status: 'IN_PROGRESS',
    payout: 140,
    description:
      'Collecte hebdomadaire des paniers frais BioMarche avec livraison vers l\'entrepot mutualise EcoDeli.',
    timeWindow: {
      start: '2025-12-11T07:45:00+01:00',
      end: '2025-12-11T10:00:00+01:00',
    },
    contact: {
      name: 'Julie Martin',
      company: 'BioMarche',
      phone: '+33 6 12 34 56 78',
      email: 'operations@biomarche.fr',
    },
    payload: {
      type: 'Produits frais',
      volume: '18 caisses',
      weight: '250 kg',
    },
    requirements: ['Vehicule frigorifique', 'Badge quai A2'],
    notes: [
      'Verifier les temperatures des caisses a +4 degC.',
      'Retour caisse pliable obligatoire avant sortie de quai.',
    ],
  },
  {
    id: 'M-20252',
    title: 'Tournee express partenaires',
    clientName: 'EcoDeli Pro',
    scheduledAt: '12 dec. 14:00',
    location: 'Villeurbanne',
    status: 'CONFIRMED',
    payout: 95,
    description: 'Tournee express multi-points pour reapprovisionnement partenaires B2B EcoDeli.',
    timeWindow: {
      start: '2025-12-12T13:30:00+01:00',
      end: '2025-12-12T16:00:00+01:00',
    },
    contact: {
      name: 'Omar Ben Youssef',
      company: 'EcoDeli Pro',
      phone: '+33 4 78 00 12 90',
      email: 'dispatch@ecodeli.fr',
    },
    payload: {
      type: 'Colis secs et PLV',
      volume: '12 colis',
    },
    requirements: ['Scanner mobile requis', 'Confirmation client a chaque stop'],
    notes: ['Payer les stationnements via badge EcoDeli si necessaire.'],
  },
  {
    id: 'M-20253',
    title: 'Livraison speciale Boulangerie',
    clientName: 'Maison Varela',
    scheduledAt: '13 dec. 07:30',
    location: 'Lyon 1er',
    status: 'PENDING',
    payout: 80,
    description: 'Livraison matinale de farines bio et emballages vers Maison Varela.',
    timeWindow: {
      start: '2025-12-13T07:00:00+01:00',
      end: '2025-12-13T09:00:00+01:00',
    },
    contact: {
      name: 'Lucie Varela',
      company: 'Maison Varela',
      phone: '+33 6 77 88 55 22',
    },
    payload: {
      type: 'Sacs de farine et emballages',
      weight: '120 kg',
    },
    requirements: ['Chariot a disposition sur place', 'Verifier la signature papier'],
    notes: ['Prevenir 15 minutes avant arrivee.'],
  },
  {
    id: 'M-20246',
    title: 'Distribution paniers Bio',
    clientName: 'Les Vergers',
    scheduledAt: '09 dec. 09:00',
    location: 'Lyon 7e',
    status: 'COMPLETED',
    payout: 110,
    description: 'Distribution des paniers hebdomadaires aux points relais de Lyon 7e.',
    timeWindow: {
      start: '2025-12-09T08:30:00+01:00',
      end: '2025-12-09T12:30:00+01:00',
    },
    contact: {
      name: 'Centre planning EcoDeli',
      phone: '+33 9 70 40 50 60',
      email: 'planning@ecodeli.fr',
    },
    payload: {
      type: 'Paniers fruits et legumes',
      volume: '40 paniers',
      weight: '200 kg',
    },
    requirements: ['Respecter la chaine du froid', 'Photo preuve depot'],
    notes: ['Mission terminee et signee par chaque relais.'],
  },
];
