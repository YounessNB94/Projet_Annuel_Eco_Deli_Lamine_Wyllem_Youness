import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import type { NotificationCategory } from '../../../shared/types/notifications';

export const courierNotificationCategories: NotificationCategory[] = [
  {
    id: 'missions',
    title: 'Missions',
    subtitle: 'Affectations, rappels et ajustements de tournée',
    icon: AssignmentTurnedInOutlinedIcon,
    accent: 'primary',
    items: [
      'Nouvelle mission disponible',
      'Mission assignée ou retirée',
      'Rappel de prise de service',
      "Modification d'itinéraire",
      'Relance sur mission en attente',
    ],
  },
  {
    id: 'realtime',
    title: 'Temps réel',
    subtitle: 'Alertes pendant la tournée et suivi des shifts',
    icon: NearMeOutlinedIcon,
    accent: 'info',
    items: [
      'Début ou fin de shift enregistrés',
      "ETA recalculé pour la tournée",
      'Alerte météo ou trafic',
      'Incident sur la route',
      'Échec de remise avec consignes',
    ],
  },
  {
    id: 'proof',
    title: 'Preuves de livraison',
    subtitle: 'Validation et compléments des preuves de remise',
    icon: FactCheckOutlinedIcon,
    accent: 'secondary',
    items: [
      'Signature ou photo requise',
      'Preuve validée',
      'Preuve refusée',
      'Demande de complément (photo floue, document manquant)',
    ],
  },
  {
    id: 'earnings',
    title: 'Gains',
    subtitle: 'Suivi des rémunérations et bonus',
    icon: EuroOutlinedIcon,
    accent: 'success',
    items: [
      'Course créditée',
      'Bonus ou prime débloqués',
      'Pourboire reçu',
      'Versement hebdomadaire effectué',
      'Versement échoué',
    ],
  },
  {
    id: 'quality',
    title: 'Qualité & sécurité',
    subtitle: 'Feedback client, incidents et alertes compte',
    icon: ShieldOutlinedIcon,
    accent: 'warning',
    items: [
      'Nouvelle note client',
      'Incident déclaré par le support',
      'Avertissement compte (SLA, comportement)',
      'Suivi dossier qualité en cours',
    ],
  },
  {
    id: 'compliance',
    title: 'Conformité & dossiers',
    subtitle: 'Gestion des documents obligatoires',
    icon: PendingActionsOutlinedIcon,
    accent: 'error',
    items: [
      'Permis ou assurance à renouveler',
      'Renouvellement casier / documents légaux',
      'Contrôle véhicule validé',
      'Suspension administrative imminente',
    ],
  },
];
