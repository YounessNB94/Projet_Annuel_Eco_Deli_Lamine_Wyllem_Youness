import { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

import { AdminStatCard } from '../components/AdminStatCard';
import { AdminSectionCard } from '../components/AdminSectionCard';
import { AdminFilterToolbar, type AdminFilterOption } from '../components/AdminFilterToolbar';
import { AdminNotificationList, type AdminNotificationItem } from '../components/AdminNotificationList';
import { AdminActivityList, type AdminActivityItem } from '../components/AdminActivityList';

const notificationStats = [
  { label: 'Notifications non lues', value: 18, helper: '3 critiques' },
  { label: 'Alertes SLA', value: 6, helper: 'Traitées dans l’heure' },
  { label: 'Campagnes suivies', value: 11, helper: '2 priorités élevées' },
  { label: 'Messages équipe', value: 24, helper: 'Dernières 24h' },
];

type NotificationFilter = 'all' | 'critical' | 'campaign' | 'delivery' | 'finance';

type NotificationVisibility = 'all' | 'unread';

const filterOptions: AdminFilterOption<NotificationFilter>[] = [
  { label: 'Toutes', value: 'all' },
  { label: 'Critiques', value: 'critical' },
  { label: 'Campagnes', value: 'campaign' },
  { label: 'Livraisons', value: 'delivery' },
  { label: 'Finance', value: 'finance' },
];

const notificationsSeed: AdminNotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Retard livraison hub Lyon',
    message: '2 créneaux dépassent de 18 min la SLA prévue.',
    timestamp: 'Il y a 6 min',
    source: 'Livraisons',
    category: 'SLA',
    severity: 'error',
    icon: <LocalShippingOutlinedIcon fontSize="small" />,
  },
  {
    id: 'notif-2',
    title: 'Campagne EcoMarket activée',
    message: 'Dossier ANN-1045 : créneau 15 déc validé.',
    timestamp: 'Il y a 25 min',
    source: 'Campagnes',
    category: 'Publication',
    icon: <CampaignOutlinedIcon fontSize="small" />,
  },
  {
    id: 'notif-3',
    title: 'Facture INV-2024-751 en retard',
    message: '30 jours de retard - relance automatique programmée.',
    timestamp: 'Il y a 1 h',
    source: 'Finance',
    category: 'Recouvrement',
    severity: 'warning',
    icon: <ReceiptLongOutlinedIcon fontSize="small" />,
  },
  {
    id: 'notif-4',
    title: 'Validation dossier CR-541',
    message: 'Tous les documents sont approuvés, prêt pour activation.',
    timestamp: 'Il y a 3 h',
    source: 'Livreurs',
    category: 'Onboarding',
    icon: <PeopleAltOutlinedIcon fontSize="small" />,
  },
];

const mapFilterToCategory = (filter: NotificationFilter) => {
  switch (filter) {
    case 'critical':
      return 'critical';
    case 'campaign':
      return 'Campagnes';
    case 'delivery':
      return 'Livraisons';
    case 'finance':
      return 'Finance';
    default:
      return undefined;
  }
};

const maintenanceActivity: AdminActivityItem[] = [
  {
    id: 'maint-1',
    title: 'Webhook notifications',
    description: 'Test automatique hebdomadaire OK.',
    timestamp: 'Il y a 2 h',
  },
  {
    id: 'maint-2',
    title: 'Canal email commerçants',
    description: 'Temps de réponse moyen 118 ms.',
    timestamp: 'Hier 22:15',
  },
  {
    id: 'maint-3',
    title: 'Centre de notifications mobile',
    description: 'Mise à jour des priorités 2.x déployée.',
    timestamp: 'Avant-hier',
  },
];

export const AdminNotificationsPage = () => {
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [visibility, setVisibility] = useState<NotificationVisibility>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState(notificationsSeed);

  const filteredNotifications = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    const category = mapFilterToCategory(filter);
    return notifications.filter((notification) => {
      const matchCategory = !category || notification.source === category;
      const matchSeverity = filter === 'critical' ? notification.severity === 'error' : true;
      const matchVisibility = visibility === 'all' || !!notification.severity;
      const matchSearch =
        normalized.length === 0 ||
        notification.title.toLowerCase().includes(normalized) ||
        notification.message.toLowerCase().includes(normalized);
      return matchCategory && matchSeverity && matchVisibility && matchSearch;
    });
  }, [filter, notifications, searchTerm, visibility]);

  const handleDismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, severity: undefined } : notification
      )
    );
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, severity: undefined })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Centre de notifications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Pilotez les alertes critiques, la communication équipes et les campagnes en un seul flux.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<DoneAllOutlinedIcon />} onClick={handleMarkAllRead}>
            Tout marquer comme lu
          </Button>
          <Button variant="contained" color="error" startIcon={<ClearAllOutlinedIcon />} onClick={handleClearAll}>
            Vider la liste
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'repeat(auto-fit, minmax(220px, 1fr))' },
        }}
      >
        {notificationStats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        }}
      >
        <AdminSectionCard
          title="Flux temps réel"
          subtitle={`${filteredNotifications.length} notifications affichées`}
          action={<Chip label={`${notifications.length} totales`} icon={<NotificationsActiveOutlinedIcon fontSize="small" />} />}
        >
          <Stack spacing={2}>
            <AdminFilterToolbar
              filters={filterOptions}
              value={filter}
              onChange={setFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Filtrer par titre ou message"
              actions={
                <ToggleButtonGroup
                  size="small"
                  color="primary"
                  value={visibility}
                  onChange={(_event, value) => value && setVisibility(value)}
                >
                  <ToggleButton value="all">Toutes</ToggleButton>
                  <ToggleButton value="unread">Non lues</ToggleButton>
                </ToggleButtonGroup>
              }
            />

            {notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Aucune notification
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vous avez vidé la liste. Les nouvelles alertes apparaîtront ici automatiquement.
                </Typography>
              </Box>
            ) : (
              <AdminNotificationList
                items={filteredNotifications}
                onDismiss={handleDismiss}
                onMarkAsRead={handleMarkAsRead}
              />
            )}
          </Stack>
        </AdminSectionCard>

        <AdminSectionCard title="Journal de diffusion" subtitle="Santé des canaux">
          <AdminActivityList items={maintenanceActivity} />
        </AdminSectionCard>
      </Box>
    </Stack>
  );
};
