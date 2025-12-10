import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import type { NotificationCategory } from '../../../shared/types/notifications';

export const merchantNotificationCategories: NotificationCategory[] = [
  {
    id: 'campaigns',
    title: 'Campagnes & annonces',
    subtitle: 'Gestion des campagnes et validations éditoriales',
    icon: CampaignOutlinedIcon,
    accent: 'primary',
    items: [
      'Création de campagne enregistrée',
      'Annonce approuvée ou refusée',
      'Actions requises sur une campagne',
      'Rappel de lancement imminent',
      'Bilan post-campagne disponible',
    ],
  },
  {
    id: 'deliveries',
    title: 'Livraisons & exécution',
    subtitle: 'Suivi des lots, incidents et exceptions logistiques',
    icon: LocalShippingOutlinedIcon,
    accent: 'info',
    items: [
      'Lot prêt ou pris en charge',
      'Retard ou incident de livraison',
      'Exception signalée (adresse, créneau)',
      'Résumé de fin de journée',
    ],
  },
  {
    id: 'capacity',
    title: 'Capacité & planning',
    subtitle: 'Alertes sur les ressources et pics d’activité',
    icon: EventBusyOutlinedIcon,
    accent: 'warning',
    items: [
      'Manque de livreurs détecté',
      'Pics de volume attendus',
      'Fenêtres critiques proches',
      'Suggestion de renfort logistique',
    ],
  },
  {
    id: 'finance',
    title: 'Finance & facturation',
    subtitle: 'Encaissements, relances et versements',
    icon: ReceiptLongOutlinedIcon,
    accent: 'success',
    items: [
      'Facture émise',
      'Échéance proche',
      'Facture en retard',
      'Versement envoyé',
      'Versement échoué',
    ],
  },
  {
    id: 'quality',
    title: 'Qualité & retours clients',
    subtitle: 'Avis, litiges et amélioration continue',
    icon: ThumbUpAltOutlinedIcon,
    accent: 'secondary',
    items: [
      'Nouvel avis client',
      'Litige ouvert',
      'Litige résolu',
      'Score de satisfaction mis à jour',
    ],
  },
  {
    id: 'account',
    title: 'Compte & équipe',
    subtitle: 'Accès, sécurité et gestion d’équipe',
    icon: GroupOutlinedIcon,
    accent: 'error',
    items: [
      'Invitation envoyée ou acceptée',
      'Changement de droits sur un membre',
      'Clé API utilisée ou limite atteinte',
      'Alerte sécurité sur le compte',
    ],
  },
];
