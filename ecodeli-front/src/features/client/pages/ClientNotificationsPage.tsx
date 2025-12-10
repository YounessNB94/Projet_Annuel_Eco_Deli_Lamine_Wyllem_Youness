import { useMemo } from 'react';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import type {
  NotificationActivityItem,
  NotificationFeedItem,
  NotificationFilterOption,
  NotificationStat,
} from '../../../shared/types/notifications';
import { NotificationCenter } from '../../../shared/components/notifications/NotificationCenter';
import { useNotificationFeed } from '../../../shared/hooks/useNotificationFeed';
import { clientNotificationCategories } from '../data/notificationCategories';

type ClientNotificationFilter =
  | 'all'
  | 'critical'
  | 'Commande & livraison'
  | 'Suivi & ETA'
  | 'Paiement'
  | 'Annonces & offres'
  | 'Support'
  | 'Compte & sécurité';

const clientNotificationsSeed: NotificationFeedItem[] = [
  {
    id: 'client-notif-1',
    title: 'Commande CMD-842 confirmée',
    message: 'Le livreur récupère votre commande dans 12 minutes.',
    timestamp: 'Il y a 5 min',
    source: 'Commande & livraison',
    category: 'Suivi de commande',
    severity: 'warning',
    icon: <LocalShippingOutlinedIcon fontSize="small" />,
  },
  {
    id: 'client-notif-2',
    title: 'Nouvelle estimation d’arrivée',
    message: 'Le créneau de livraison est maintenant prévu entre 18 h 10 et 18 h 25.',
    timestamp: 'Il y a 14 min',
    source: 'Suivi & ETA',
    category: 'Temps réel',
    severity: 'info',
    icon: <AccessTimeOutlinedIcon fontSize="small" />,
  },
  {
    id: 'client-notif-3',
    title: 'Paiement sécurisé',
    message: 'Votre paiement de 42,50 € a été validé. Reçu disponible.',
    timestamp: 'Il y a 32 min',
    source: 'Paiement',
    category: 'Facturation',
    severity: 'success',
    icon: <CreditCardOutlinedIcon fontSize="small" />,
  },
  {
    id: 'client-notif-4',
    title: 'Réponse du support',
    message: 'Nous avons mis à jour votre créneau de livraison comme demandé.',
    timestamp: 'Il y a 1 h',
    source: 'Support',
    category: 'Ticket #SUP-204',
    severity: 'info',
    icon: <SupportAgentOutlinedIcon fontSize="small" />,
  },
  {
    id: 'client-notif-5',
    title: 'Nouvelle connexion détectée',
    message: 'Connexion depuis un nouvel appareil à Lyon. Vérifiez si c’était vous.',
    timestamp: 'Il y a 3 h',
    source: 'Compte & sécurité',
    category: 'Sécurité',
    severity: 'error',
    icon: <SecurityOutlinedIcon fontSize="small" />,
  },
  {
    id: 'client-notif-6',
    title: 'Offre préférentielle',
    message: 'Profitez de -15 % sur votre prochaine livraison express avant dimanche.',
    timestamp: 'Hier',
    source: 'Annonces & offres',
    category: 'Promotion',
    icon: <CampaignOutlinedIcon fontSize="small" />,
  },
];

const clientActivityLog: NotificationActivityItem[] = [
  {
    id: 'client-activity-1',
    title: 'Push mobile livré',
    description: 'Taux d’ouverture 64 % sur la dernière campagne.',
    timestamp: 'Aujourd’hui 09:02',
  },
  {
    id: 'client-activity-2',
    title: 'Emails transactionnels',
    description: 'Temps de délivrance moyen 48 secondes.',
    timestamp: 'Hier 21:18',
  },
  {
    id: 'client-activity-3',
    title: 'Canal SMS',
    description: 'Aucun échec sur les 120 derniers envois.',
    timestamp: 'Hier 17:40',
  },
];

const clientFilterOptions: NotificationFilterOption<ClientNotificationFilter>[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'Critiques', value: 'critical' },
  { label: 'Livraisons', value: 'Commande & livraison' },
  { label: 'Suivi', value: 'Suivi & ETA' },
  { label: 'Paiements', value: 'Paiement' },
  { label: 'Offres', value: 'Annonces & offres' },
  { label: 'Support', value: 'Support' },
  { label: 'Sécurité', value: 'Compte & sécurité' },
];

export const ClientNotificationsPage = () => {
  const {
    items,
    filteredItems,
    filter,
    setFilter,
    visibility,
    setVisibility,
    searchTerm,
    setSearchTerm,
    markAsRead,
    dismiss,
    markAllAsRead,
    clearAll,
    unreadCount,
    totalCount,
  } = useNotificationFeed<ClientNotificationFilter>({
    initialItems: clientNotificationsSeed,
    initialFilter: 'all',
  });

  const criticalCount = useMemo(
    () => items.filter((item) => item.severity === 'error').length,
    [items],
  );

  const deliveryAlerts = useMemo(
    () => items.filter((item) => item.source === 'Commande & livraison').length,
    [items],
  );

  const paymentAlerts = useMemo(
    () => items.filter((item) => item.source === 'Paiement').length,
    [items],
  );

  const stats = useMemo<NotificationStat[]>(
    () => [
      { label: 'Notifications non lues', value: unreadCount, helper: `${criticalCount} critiques` },
      { label: 'Livraisons à suivre', value: deliveryAlerts, helper: 'Mises à jour temps réel' },
      { label: 'Transactions récentes', value: paymentAlerts, helper: '48 h glissantes' },
    ],
    [criticalCount, deliveryAlerts, paymentAlerts, unreadCount],
  );

  const handleFilterChange = (value: string) => setFilter(value as ClientNotificationFilter);

  return (
    <NotificationCenter
      overline="Notifications"
      title="Centre de notifications client"
      description="Retrouvez ici toutes les alertes qu’EcoDeli peut vous envoyer selon vos activités : commandes, suivis de livraison, paiements, annonces et sécurité du compte."
      roleLabel="Client"
      categories={clientNotificationCategories}
      stats={stats}
      filters={clientFilterOptions}
      filterValue={filter}
      onFilterChange={handleFilterChange}
      visibility={visibility}
      onVisibilityChange={setVisibility}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      items={filteredItems}
      totalItemsCount={totalCount}
      onDismiss={dismiss}
      onMarkAsRead={markAsRead}
      onMarkAllRead={markAllAsRead}
      onClearAll={clearAll}
      activityItems={clientActivityLog}
      activityTitle="Historique des canaux"
      activitySubtitle="Diffusions automatiques et reprises"
      categoriesTitle="Catégories d’alertes"
    />
  );
};
