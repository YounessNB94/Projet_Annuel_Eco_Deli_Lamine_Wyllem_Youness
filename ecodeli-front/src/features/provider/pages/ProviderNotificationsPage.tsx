import { useMemo } from 'react';
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

type ProviderNotificationFilter =
  | 'all'
  | 'critical'
  | 'Disponibilités'
  | 'Affectations'
  | 'Performance'
  | 'Finance'
  | 'Conformité & contrats'
  | 'Intégrations techniques';

const providerNotificationsSeed: NotificationFeedItem[] = [
  {
    id: 'provider-notif-1',
    title: 'Créneau du 15 déc surchargé',
    message: 'Ajoutez 3 équipes supplémentaires pour couvrir la demande.',
    timestamp: 'Il y a 10 min',
    source: 'Disponibilités',
    category: 'Planification',
    severity: 'warning',
    icon: <EventAvailableOutlinedIcon fontSize="small" />,
  },
  {
    id: 'provider-notif-2',
    title: 'Mission HUB-92 replanifiée',
    message: 'Nouveau départ à 14 h 45, confirmation nécessaire.',
    timestamp: 'Il y a 28 min',
    source: 'Affectations',
    category: 'Replanification',
    severity: 'info',
    icon: <AssignmentTurnedInOutlinedIcon fontSize="small" />,
  },
  {
    id: 'provider-notif-3',
    title: 'Performance Lyon Semaine 49',
    message: 'Taux de prise en charge 94 %, objectif atteint.',
    timestamp: 'Il y a 55 min',
    source: 'Performance',
    category: 'Synthèse',
    icon: <TrendingUpOutlinedIcon fontSize="small" />,
  },
  {
    id: 'provider-notif-4',
    title: 'Facture #FAC-302 déposée',
    message: '1 820,00 € seront versés sous 72 h après validation.',
    timestamp: 'Il y a 2 h',
    source: 'Finance',
    category: 'Facturation',
    severity: 'success',
    icon: <EuroOutlinedIcon fontSize="small" />,
  },
  {
    id: 'provider-notif-5',
    title: 'Permis C à renouveler',
    message: '3 chauffeurs concernés, délai limite 7 jours.',
    timestamp: 'Hier 19:30',
    source: 'Conformité & contrats',
    category: 'Document',
    severity: 'warning',
    icon: <FactCheckOutlinedIcon fontSize="small" />,
  },
  {
    id: 'provider-notif-6',
    title: 'Webhook planning en erreur',
    message: '5 requêtes échouées sur les 30 dernières minutes.',
    timestamp: 'Hier 17:55',
    source: 'Intégrations techniques',
    category: 'Incident',
    severity: 'error',
    icon: <SettingsInputComponentOutlinedIcon fontSize="small" />,
  },
];

const providerActivityLog: NotificationActivityItem[] = [
  {
    id: 'provider-activity-1',
    title: 'Webhook missions',
    description: 'Dernier test automatique réussi ce matin.',
    timestamp: 'Aujourd’hui 08:10',
  },
  {
    id: 'provider-activity-2',
    title: 'Exports KPI hebdo',
    description: 'Rapport 100 % livré aux partenaires.',
    timestamp: 'Hier 21:05',
  },
  {
    id: 'provider-activity-3',
    title: 'API disponibilité',
    description: 'Temps de réponse moyen 180 ms.',
    timestamp: 'Hier 18:32',
  },
];

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

export const ProviderNotificationsPage = () => {
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
  } = useNotificationFeed<ProviderNotificationFilter>({
    initialItems: providerNotificationsSeed,
    initialFilter: 'all',
  });

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
      activityItems={providerActivityLog}
      activityTitle="Santé des intégrations"
      activitySubtitle="Derniers contrôles automatisés"
      categoriesTitle="Cartographie des alertes"
    />
  );
};
