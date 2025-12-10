import { useMemo } from 'react';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import type {
  NotificationActivityItem,
  NotificationFeedItem,
  NotificationFilterOption,
  NotificationStat,
} from '../../../shared/types/notifications';
import { NotificationCenter } from '../../../shared/components/notifications/NotificationCenter';
import { useNotificationFeed } from '../../../shared/hooks/useNotificationFeed';
import { merchantNotificationCategories } from '../data/notificationCategories';

type MerchantNotificationFilter =
  | 'all'
  | 'critical'
  | 'Campagnes & annonces'
  | 'Livraisons & exécution'
  | 'Capacité & planning'
  | 'Finance & facturation'
  | 'Qualité & retours clients'
  | 'Compte & équipe';

const merchantNotificationsSeed: NotificationFeedItem[] = [
  {
    id: 'merchant-notif-1',
    title: 'Campagne "Bio Locale" prête à publier',
    message: 'Validez le budget final avant 18 h pour activer la campagne.',
    timestamp: 'Il y a 8 min',
    source: 'Campagnes & annonces',
    category: 'Activation',
    severity: 'warning',
    icon: <CampaignOutlinedIcon fontSize="small" />,
  },
  {
    id: 'merchant-notif-2',
    title: 'Incident de livraison lot #LIV-247',
    message: 'Deux colis signalés en retard par le hub de Bellecour.',
    timestamp: 'Il y a 22 min',
    source: 'Livraisons & exécution',
    category: 'Retard',
    severity: 'error',
    icon: <LocalShippingOutlinedIcon fontSize="small" />,
  },
  {
    id: 'merchant-notif-3',
    title: 'Versement #VRS-578 confirmé',
    message: '6 430,00 € seront crédités sur votre compte sous 48 h.',
    timestamp: 'Il y a 1 h',
    source: 'Finance & facturation',
    category: 'Paiement',
    severity: 'success',
    icon: <ReceiptLongOutlinedIcon fontSize="small" />,
  },
  {
    id: 'merchant-notif-4',
    title: 'Avis client 4,8 ★',
    message: 'Anaïs (Lyon) recommande votre offre click & collect.',
    timestamp: 'Il y a 3 h',
    source: 'Qualité & retours clients',
    category: 'Satisfaction',
    severity: 'info',
    icon: <ThumbUpAltOutlinedIcon fontSize="small" />,
  },
  {
    id: 'merchant-notif-5',
    title: 'Droits mis à jour pour Paul R.',
    message: 'Le rôle Gestionnaire financier a été appliqué.',
    timestamp: 'Hier',
    source: 'Compte & équipe',
    category: 'Accès',
    icon: <GroupOutlinedIcon fontSize="small" />,
  },
  {
    id: 'merchant-notif-6',
    title: 'Pic de volume prévu vendredi',
    message: 'Préparez 20 % de capacité supplémentaire sur le créneau 17 h.',
    timestamp: 'Hier 18:10',
    source: 'Capacité & planning',
    category: 'Prévision',
    severity: 'warning',
    icon: <EventBusyOutlinedIcon fontSize="small" />,
  },
];

const merchantActivityLog: NotificationActivityItem[] = [
  {
    id: 'merchant-activity-1',
    title: 'Webhook campagnes',
    description: 'Test hebdomadaire réussi en 112 ms.',
    timestamp: 'Aujourd’hui 07:45',
  },
  {
    id: 'merchant-activity-2',
    title: 'Canal SMS commerçants',
    description: 'Taux de délivrabilité 99,2 % sur 24 h.',
    timestamp: 'Hier 22:05',
  },
  {
    id: 'merchant-activity-3',
    title: 'API versements',
    description: 'Quota journalier consommé à 63 %.',
    timestamp: 'Hier 18:20',
  },
];

const merchantFilterOptions: NotificationFilterOption<MerchantNotificationFilter>[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'Critiques', value: 'critical' },
  { label: 'Campagnes', value: 'Campagnes & annonces' },
  { label: 'Livraisons', value: 'Livraisons & exécution' },
  { label: 'Capacité', value: 'Capacité & planning' },
  { label: 'Finance', value: 'Finance & facturation' },
  { label: 'Qualité', value: 'Qualité & retours clients' },
  { label: 'Compte', value: 'Compte & équipe' },
];

export const MerchantNotificationsPage = () => {
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
  } = useNotificationFeed<MerchantNotificationFilter>({
    initialItems: merchantNotificationsSeed,
    initialFilter: 'all',
  });

  const criticalCount = useMemo(
    () => items.filter((item) => item.severity === 'error').length,
    [items],
  );

  const logisticsAlerts = useMemo(
    () => items.filter((item) => item.source === 'Livraisons & exécution').length,
    [items],
  );

  const stats = useMemo<NotificationStat[]>(
    () => [
      { label: 'Notifications non lues', value: unreadCount, helper: `${criticalCount} critiques` },
      { label: 'Alertes logistiques', value: logisticsAlerts, helper: 'Dernières 24 h' },
      { label: 'Campagnes actives', value: 4, helper: '1 lancement demain' },
    ],
    [criticalCount, logisticsAlerts, unreadCount],
  );

  const handleFilterChange = (value: string) => setFilter(value as MerchantNotificationFilter);

  return (
    <NotificationCenter
      overline="Notifications"
      title="Centre de notifications commerçant"
      description="Restez informé des campagnes, de la logistique, de la finance et de la qualité client pour piloter votre activité EcoDeli sans surprise."
      roleLabel="Commerçant"
      categories={merchantNotificationCategories}
      stats={stats}
      filters={merchantFilterOptions}
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
      activityItems={merchantActivityLog}
      activityTitle="Suivi des canaux"
      activitySubtitle="Tests automatisés et indicateurs temps réel"
      categoriesTitle="Guides d’alertes"
    />
  );
};
