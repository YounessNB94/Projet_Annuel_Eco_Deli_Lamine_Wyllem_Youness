import { useEffect, useMemo, type ReactElement } from 'react';
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
import { useClientNotificationFeed } from '../hooks/useClientNotificationFeed';
import { useClientNotificationActivity } from '../hooks/useClientNotificationActivity';
import type {
  ClientNotificationIconKey,
  ClientNotificationRecord,
  ClientNotificationActivityRecord,
} from '../api/clientNotifications';

type ClientNotificationFilter =
  | 'all'
  | 'critical'
  | 'Commande & livraison'
  | 'Suivi & ETA'
  | 'Paiement'
  | 'Annonces & offres'
  | 'Support'
  | 'Compte & sécurité';

const notificationIconFactory: Record<ClientNotificationIconKey, () => ReactElement> = {
  orders: () => <LocalShippingOutlinedIcon fontSize="small" />,
  eta: () => <AccessTimeOutlinedIcon fontSize="small" />,
  payment: () => <CreditCardOutlinedIcon fontSize="small" />,
  support: () => <SupportAgentOutlinedIcon fontSize="small" />,
  security: () => <SecurityOutlinedIcon fontSize="small" />,
  campaign: () => <CampaignOutlinedIcon fontSize="small" />,
};

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

const mapNotificationToFeedItem = (notification: ClientNotificationRecord): NotificationFeedItem => ({
  id: notification.id,
  title: notification.title,
  message: notification.message,
  timestamp: notification.timestamp,
  source: notification.source,
  category: notification.category,
  severity: notification.severity,
  icon: notificationIconFactory[notification.icon](),
});

export const ClientNotificationsPage = () => {
  const { data: notificationFeed = [] } = useClientNotificationFeed();
  const { data: notificationActivity = [] } = useClientNotificationActivity();

  const mappedNotifications = useMemo<NotificationFeedItem[]>(
    () => notificationFeed.map(mapNotificationToFeedItem),
    [notificationFeed],
  );

  const activityItems = useMemo<NotificationActivityItem[]>(
    () => notificationActivity.map((activity: ClientNotificationActivityRecord) => ({ ...activity })),
    [notificationActivity],
  );

  const {
    items,
    filteredItems,
    filter,
    setFilter,
    visibility,
    setVisibility,
    searchTerm,
    setSearchTerm,
    setItems,
    markAsRead,
    dismiss,
    markAllAsRead,
    clearAll,
    unreadCount,
    totalCount,
  } = useNotificationFeed<ClientNotificationFilter>({
    initialItems: [],
    initialFilter: 'all',
  });

  useEffect(() => {
    setItems(mappedNotifications);
  }, [mappedNotifications, setItems]);

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
      activityItems={activityItems}
      activityTitle="Historique des canaux"
      activitySubtitle="Diffusions automatiques et reprises"
      categoriesTitle="Catégories d’alertes"
    />
  );
};
