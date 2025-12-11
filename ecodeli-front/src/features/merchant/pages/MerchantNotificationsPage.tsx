import { useEffect, useMemo, type ReactElement } from 'react';
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
import { useMerchantNotificationFeed } from '../hooks/useMerchantNotificationFeed';
import { useMerchantNotificationActivity } from '../hooks/useMerchantNotificationActivity';
import type {
  MerchantNotificationActivityRecord,
  MerchantNotificationIconKey,
  MerchantNotificationRecord,
} from '../api/merchantNotifications';

type MerchantNotificationFilter =
  | 'all'
  | 'critical'
  | 'Campagnes & annonces'
  | 'Livraisons & exécution'
  | 'Capacité & planning'
  | 'Finance & facturation'
  | 'Qualité & retours clients'
  | 'Compte & équipe';

const notificationIconFactory: Record<MerchantNotificationIconKey, () => ReactElement> = {
  campaign: () => <CampaignOutlinedIcon fontSize="small" />,
  logistics: () => <LocalShippingOutlinedIcon fontSize="small" />,
  capacity: () => <EventBusyOutlinedIcon fontSize="small" />,
  finance: () => <ReceiptLongOutlinedIcon fontSize="small" />,
  quality: () => <ThumbUpAltOutlinedIcon fontSize="small" />,
  account: () => <GroupOutlinedIcon fontSize="small" />,
};

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

const mapNotificationToFeedItem = (
  notification: MerchantNotificationRecord,
): NotificationFeedItem => ({
  id: notification.id,
  title: notification.title,
  message: notification.message,
  timestamp: notification.timestamp,
  source: notification.source,
  category: notification.category,
  severity: notification.severity,
  icon: notificationIconFactory[notification.icon](),
});

export const MerchantNotificationsPage = () => {
  const { data: notificationFeed = [] } = useMerchantNotificationFeed();
  const { data: notificationActivity = [] } = useMerchantNotificationActivity();

  const mappedNotifications = useMemo<NotificationFeedItem[]>(
    () => notificationFeed.map(mapNotificationToFeedItem),
    [notificationFeed],
  );

  const activityItems = useMemo<NotificationActivityItem[]>(
    () => notificationActivity.map((activity: MerchantNotificationActivityRecord) => ({ ...activity })),
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
  } = useNotificationFeed<MerchantNotificationFilter>({
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
      activityItems={activityItems}
      activityTitle="Suivi des canaux"
      activitySubtitle="Tests automatisés et indicateurs temps réel"
      categoriesTitle="Guides d’alertes"
    />
  );
};
