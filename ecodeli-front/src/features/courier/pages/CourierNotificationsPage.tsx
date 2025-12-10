import { useMemo } from 'react';
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

type CourierNotificationFilter =
  | 'all'
  | 'critical'
  | 'Missions'
  | 'Temps réel'
  | 'Preuves de livraison'
  | 'Gains'
  | 'Qualité & sécurité'
  | 'Conformité & dossiers';

const courierNotificationsSeed: NotificationFeedItem[] = [
  {
    id: 'courier-notif-1',
    title: 'Mission #RUN-452 assignée',
    message: 'Départ hub Part-Dieu à 17 h 30, 6 colis à livrer.',
    timestamp: 'Il y a 4 min',
    source: 'Missions',
    category: 'Affectation',
    severity: 'warning',
    icon: <AssignmentTurnedInOutlinedIcon fontSize="small" />,
  },
  {
    id: 'courier-notif-2',
    title: 'Trafic dense sur A7',
    message: 'Temps estimé prolongé de 12 minutes pour la tournée en cours.',
    timestamp: 'Il y a 12 min',
    source: 'Temps réel',
    category: 'Trafic',
    severity: 'error',
    icon: <NearMeOutlinedIcon fontSize="small" />,
  },
  {
    id: 'courier-notif-3',
    title: 'Preuve de livraison requise',
    message: 'Photo obligatoire pour la commande CMD-918.',
    timestamp: 'Il y a 35 min',
    source: 'Preuves de livraison',
    category: 'Justificatif',
    severity: 'warning',
    icon: <FactCheckOutlinedIcon fontSize="small" />,
  },
  {
    id: 'courier-notif-4',
    title: 'Bonus express débloqué',
    message: 'Prime +8 € pour la vague du soir.',
    timestamp: 'Il y a 1 h',
    source: 'Gains',
    category: 'Rémunération',
    severity: 'success',
    icon: <EuroOutlinedIcon fontSize="small" />,
  },
  {
    id: 'courier-notif-5',
    title: 'Feedback client 5 ★',
    message: 'Bravo ! Livraison CMD-903 notée 5/5.',
    timestamp: 'Il y a 3 h',
    source: 'Qualité & sécurité',
    category: 'Satisfaction',
    icon: <ShieldOutlinedIcon fontSize="small" />,
  },
  {
    id: 'courier-notif-6',
    title: 'Permis à renouveler',
    message: 'Votre permis expire dans 10 jours, pensez au renouvellement.',
    timestamp: 'Hier 19:40',
    source: 'Conformité & dossiers',
    category: 'Document',
    severity: 'warning',
    icon: <PendingActionsOutlinedIcon fontSize="small" />,
  },
];

const courierActivityLog: NotificationActivityItem[] = [
  {
    id: 'courier-activity-1',
    title: 'Capteur GPS',
    description: 'Synchronisation réussie sur 12 tournées.',
    timestamp: 'Aujourd’hui 08:20',
  },
  {
    id: 'courier-activity-2',
    title: 'Support livreur',
    description: 'Temps de réponse médian 1 min 45.',
    timestamp: 'Hier 22:10',
  },
  {
    id: 'courier-activity-3',
    title: 'Scan preuves',
    description: 'Aucun rejet sur les 40 dernières preuves.',
    timestamp: 'Hier 18:05',
  },
];

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

export const CourierNotificationsPage = () => {
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
  } = useNotificationFeed<CourierNotificationFilter>({
    initialItems: courierNotificationsSeed,
    initialFilter: 'all',
  });

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
      activityItems={courierActivityLog}
      activityTitle="Suivi quotidien"
      activitySubtitle="Performances terrain et support"
      categoriesTitle="Typologies d’alertes"
    />
  );
};
