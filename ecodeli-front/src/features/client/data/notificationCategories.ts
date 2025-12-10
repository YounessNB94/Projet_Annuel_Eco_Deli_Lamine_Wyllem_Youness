import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import type { NotificationCategory } from '../../../shared/types/notifications';

export const clientNotificationCategories: NotificationCategory[] = [
  {
    id: 'orders',
    title: 'Commande & livraison',
    subtitle: 'Toutes les étapes clés de vos livraisons',
    icon: LocalShippingOutlinedIcon,
    accent: 'primary',
    items: [
      'Confirmation de commande',
      'Coursier assigné',
      'Livraison en cours',
      'Livraison en retard',
      'Livraison effectuée',
      'Échec de livraison',
    ],
  },
  {
    id: 'tracking',
    title: 'Suivi & ETA',
    subtitle: "Les informations temps réel sur l’arrivée de votre colis",
    icon: AccessTimeOutlinedIcon,
    accent: 'info',
    items: [
      "Mise à jour de l'ETA",
      'Livreur à proximité',
      'Replanification nécessaire',
    ],
  },
  {
    id: 'payments',
    title: 'Paiement',
    subtitle: 'Statut des transactions et documents disponibles',
    icon: CreditCardOutlinedIcon,
    accent: 'success',
    items: [
      'Paiement reçu',
      'Échec de paiement',
      'Remboursement effectué',
      'Reçu disponible',
    ],
  },
  {
    id: 'campaigns',
    title: 'Annonces & offres',
    subtitle: 'Campagnes et opportunités pour vos livraisons',
    icon: CampaignOutlinedIcon,
    accent: 'warning',
    items: [
      'Nouvelles campagnes disponibles',
      'Créneaux ouverts',
      'Promotions et réductions',
    ],
  },
  {
    id: 'support',
    title: 'Support',
    subtitle: 'Suivi de vos demandes auprès du support EcoDeli',
    icon: SupportAgentOutlinedIcon,
    accent: 'secondary',
    items: [
      'Réponse à un ticket',
      'Message du support',
      'Fermeture de ticket',
    ],
  },
  {
    id: 'security',
    title: 'Compte & sécurité',
    subtitle: 'Protection et activité de votre compte',
    icon: SecurityOutlinedIcon,
    accent: 'error',
    items: [
      'Nouvelle connexion',
      'Vérification en deux étapes (2FA)',
      'Changement de mot de passe',
    ],
  },
];
