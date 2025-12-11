import { useEffect, useMemo, type ReactElement } from 'react';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import type {
  NotificationActivityItem,
  NotificationFeedItem,
  NotificationFilterOption,
  NotificationStat,
} from '../../../shared/types/notifications';
import { NotificationCenter } from '../../../shared/components/notifications/NotificationCenter';
import { useNotificationFeed } from '../../../shared/hooks/useNotificationFeed';
import { courierNotificationCategories } from '../data/notificationCategories';
import { useCourierNotificationFeed } from '../hooks/useCourierNotificationFeed';
import { useCourierNotificationActivity } from '../hooks/useCourierNotificationActivity';
import type {
  CourierNotificationActivityRecord,
  CourierNotificationIconKey,
  CourierNotificationRecord,
} from '../api/courierNotifications';

type CourierNotificationFilter =
  | 'all'
  | 'critical'
  | 'Missions'
  | 'Temps réel'
  | 'Preuves de livraison'
  | 'Gains'
  | 'Qualité & sécurité'
  | 'Conformité & dossiers';

const notificationIconFactory: Record<CourierNotificationIconKey, () => ReactElement> = {
  missions: () => <AssignmentTurnedInOutlinedIcon fontSize="small" />,
  realtime: () => <NearMeOutlinedIcon fontSize="small" />,
  proof: () => <FactCheckOutlinedIcon fontSize="small" />,
  earnings: () => <EuroOutlinedIcon fontSize="small" />,
  quality: () => <ShieldOutlinedIcon fontSize="small" />,
  compliance: () => <PendingActionsOutlinedIcon fontSize="small" />,
};

const courierFilterOptions: NotificationFilterOption<CourierNotificationFilter>[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'Critiques', value: 'critical' },
  { label: 'Missions', value: 'Missions' },
  { label: 'Temps réel', value: 'Temps réel' },
  { label: 'Preuves', value: 'Preuves de livraison' },
  { label: 'Gains', value: 'Gains' },
  { label: 'Qualité', value: 'Qualité & sécurité' },
  { label: 'Conformité', value: 'Conformité & dossiers' },
];

const mapNotificationToFeedItem = (
  notification: CourierNotificationRecord,
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

export const CourierNotificationsPage = () => {
  const { data: notificationFeed = [] } = useCourierNotificationFeed();
  const { data: notificationActivity = [] } = useCourierNotificationActivity();

  const mappedNotifications = useMemo<NotificationFeedItem[]>(
    () => notificationFeed.map(mapNotificationToFeedItem),
    [notificationFeed],
  );

  const activityItems = useMemo<NotificationActivityItem[]>(
    () => notificationActivity.map((activity: CourierNotificationActivityRecord) => ({ ...activity })),
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
  } = useNotificationFeed<CourierNotificationFilter>({
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

  const operationalAlerts = useMemo(
    () => items.filter((item) => item.source === 'Missions' || item.source === 'Temps réel').length,
    [items],
  );

  const documentsToRenew = useMemo(
    () => items.filter((item) => item.source === 'Conformité & dossiers').length,
    [items],
  );

  const stats = useMemo<NotificationStat[]>(
    () => [
      { label: 'Notifications non lues', value: unreadCount, helper: `${criticalCount} critiques` },
      { label: 'Alertes opérationnelles', value: operationalAlerts, helper: 'Turnée en cours' },
      { label: 'Documents à renouveler', value: documentsToRenew, helper: 'Sous 2 semaines' },
    ],
    [criticalCount, documentsToRenew, operationalAlerts, unreadCount],
  );

  const handleFilterChange = (value: string) => setFilter(value as CourierNotificationFilter);

  return (
    <NotificationCenter
      overline="Notifications"
      title="Centre de notifications livreur"
      description="Visualisez l’ensemble des alertes qui jalonnent votre activité : missions assignées, suivi temps réel, preuves de livraison, rémunération et conformité."
      roleLabel="Livreur"
      categories={courierNotificationCategories}
      stats={stats}
      filters={courierFilterOptions}
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
      activityTitle="Suivi quotidien"
      activitySubtitle="Performances terrain et support"
      categoriesTitle="Typologies d’alertes"
    />
  );
};
