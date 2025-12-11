import { useEffect, useMemo, type ReactElement } from 'react';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import EuroOutlinedIcon from '@mui/icons-material/EuroOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import SettingsInputComponentOutlinedIcon from '@mui/icons-material/SettingsInputComponentOutlined';
import type {
  NotificationActivityItem,
  NotificationFeedItem,
  NotificationFilterOption,
  NotificationStat,
} from '../../../shared/types/notifications';
import { NotificationCenter } from '../../../shared/components/notifications/NotificationCenter';
import { useNotificationFeed } from '../../../shared/hooks/useNotificationFeed';
import { providerNotificationCategories } from '../data/notificationCategories';
import { useProviderNotificationFeed } from '../hooks/useProviderNotificationFeed';
import { useProviderNotificationActivity } from '../hooks/useProviderNotificationActivity';
import type {
  ProviderNotificationActivityRecord,
  ProviderNotificationIconKey,
  ProviderNotificationRecord,
} from '../api/providerNotifications';

type ProviderNotificationFilter =
  | 'all'
  | 'critical'
  | 'Disponibilités'
  | 'Affectations'
  | 'Performance'
  | 'Finance'
  | 'Conformité & contrats'
  | 'Intégrations techniques';

const notificationIconFactory: Record<ProviderNotificationIconKey, () => ReactElement> = {
  availability: () => <EventAvailableOutlinedIcon fontSize="small" />,
  assignment: () => <AssignmentTurnedInOutlinedIcon fontSize="small" />,
  performance: () => <TrendingUpOutlinedIcon fontSize="small" />,
  finance: () => <EuroOutlinedIcon fontSize="small" />,
  compliance: () => <FactCheckOutlinedIcon fontSize="small" />,
  integrations: () => <SettingsInputComponentOutlinedIcon fontSize="small" />,
};

const providerFilterOptions: NotificationFilterOption<ProviderNotificationFilter>[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'Critiques', value: 'critical' },
  { label: 'Disponibilités', value: 'Disponibilités' },
  { label: 'Affectations', value: 'Affectations' },
  { label: 'Performance', value: 'Performance' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Conformité', value: 'Conformité & contrats' },
  { label: 'Intégrations', value: 'Intégrations techniques' },
];

const mapNotificationToFeedItem = (
  notification: ProviderNotificationRecord,
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

export const ProviderNotificationsPage = () => {
  const { data: notificationFeed = [] } = useProviderNotificationFeed();
  const { data: notificationActivity = [] } = useProviderNotificationActivity();

  const mappedNotifications = useMemo<NotificationFeedItem[]>(
    () => notificationFeed.map(mapNotificationToFeedItem),
    [notificationFeed],
  );

  const activityItems = useMemo<NotificationActivityItem[]>(
    () => notificationActivity.map((activity: ProviderNotificationActivityRecord) => ({ ...activity })),
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
  } = useNotificationFeed<ProviderNotificationFilter>({
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

  const capacitySignals = useMemo(
    () => items.filter((item) => item.source === 'Disponibilités' || item.source === 'Affectations').length,
    [items],
  );

  const technicalIncidents = useMemo(
    () => items.filter((item) => item.source === 'Intégrations techniques').length,
    [items],
  );

  const stats = useMemo<NotificationStat[]>(
    () => [
      { label: 'Notifications non lues', value: unreadCount, helper: `${criticalCount} critiques` },
      { label: 'Alertes capacité', value: capacitySignals, helper: 'Prochains 3 jours' },
      { label: 'Incidents techniques', value: technicalIncidents, helper: 'Surveillance API' },
    ],
    [capacitySignals, criticalCount, technicalIncidents, unreadCount],
  );

  const handleFilterChange = (value: string) => setFilter(value as ProviderNotificationFilter);

  return (
    <NotificationCenter
      overline="Notifications"
      title="Centre de notifications prestataire"
      description="Retrouvez les alertes clés pour piloter vos disponibilités, missions, performances opérationnelles, finances et obligations contractuelles."
      roleLabel="Prestataire"
      categories={providerNotificationCategories}
      stats={stats}
      filters={providerFilterOptions}
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
      activityTitle="Santé des intégrations"
      activitySubtitle="Derniers contrôles automatisés"
      categoriesTitle="Cartographie des alertes"
    />
  );
};
