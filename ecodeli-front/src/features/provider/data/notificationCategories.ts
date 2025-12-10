import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import SettingsInputComponentOutlinedIcon from '@mui/icons-material/SettingsInputComponentOutlined';
import type { NotificationCategory } from '../../../shared/types/notifications';

export const providerNotificationCategories: NotificationCategory[] = [
  {
    id: 'availability',
    title: 'Disponibilités',
    subtitle: 'Gestion des créneaux et couverture des zones',
    icon: EventAvailableOutlinedIcon,
    accent: 'primary',
    items: [
      'Rappel de créneau à venir',
      'Conflit ou créneau surchargé',
      'Synchronisation calendrier réussie ou échouée',
      'Zone non couverte détectée',
    ],
  },
  {
    id: 'assignments',
    title: 'Affectations',
    subtitle: 'Demandes, confirmations et replanifications de missions',
    icon: AssignmentTurnedInOutlinedIcon,
    accent: 'info',
    items: [
      'Nouvelle demande de mission',
      'Mission confirmée ou annulée',
      'Mission replanifiée',
      'Risque de dépassement SLA',
    ],
  },
  {
    id: 'performance',
    title: 'Performance',
    subtitle: 'Volumes, pics et synthèses opérationnelles',
    icon: TrendingUpOutlinedIcon,
    accent: 'secondary',
    items: [
      'Utilisation / charge hebdomadaire',
      'Périodes critiques signalées',
      'Synthèse hebdomadaire disponible',
      'Comparatif vs objectifs',
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    subtitle: 'Factures, paiements et ajustements',
    icon: EuroOutlinedIcon,
    accent: 'success',
    items: [
      'Facture générée',
      'Paiement envoyé',
      'Paiement échoué',
      'Ajustement ajouté',
    ],
  },
  {
    id: 'compliance',
    title: 'Conformité & contrats',
    subtitle: 'Suivi des obligations légales et contractuelles',
    icon: FactCheckOutlinedIcon,
    accent: 'warning',
    items: [
      'Document à renouveler',
      'Contrôle qualité validé',
      'Avenant à signer',
      'Suspension préventive imminente',
    ],
  },
  {
    id: 'integrations',
    title: 'Intégrations techniques',
    subtitle: 'État des webhooks et des accès API',
    icon: SettingsInputComponentOutlinedIcon,
    accent: 'error',
    items: [
      'Webhook en échec',
      'Limite API atteinte',
      'Clé invalide ou expirée',
      'Intégration rétablie',
    ],
  },
];
