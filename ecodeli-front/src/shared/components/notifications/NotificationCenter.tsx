import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import type { FC, ReactNode } from 'react';
import type {
  NotificationActivityItem,
  NotificationCenterContent,
  NotificationFeedItem,
  NotificationFilterOption,
  NotificationStat,
  NotificationVisibility,
} from '../../types/notifications';
import { NotificationCategoryCard } from './NotificationCategoryCard';
import { NotificationStatCard } from './NotificationStatCard';
import { NotificationSectionCard } from './NotificationSectionCard';
import { NotificationFilterToolbar } from './NotificationFilterToolbar';
import { NotificationFeedList } from './NotificationFeedList';
import { NotificationActivityList } from './NotificationActivityList';
import { NotificationVisibilityToggle } from './NotificationVisibilityToggle';

interface NotificationCenterProps extends NotificationCenterContent {
  stats?: NotificationStat[];
  filters?: NotificationFilterOption<string>[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  visibility?: NotificationVisibility;
  onVisibilityChange?: (value: NotificationVisibility) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  toolbarExtraFilters?: ReactNode;
  toolbarActions?: ReactNode;
  items?: NotificationFeedItem[];
  totalItemsCount?: number;
  listTitle?: string;
  listSubtitle?: string;
  listEmptyState?: ReactNode;
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
  activityItems?: NotificationActivityItem[];
  activityTitle?: string;
  activitySubtitle?: string;
  activityEmptyState?: ReactNode;
  categoriesTitle?: string;
  categoriesSubtitle?: string;
  headActions?: ReactNode;
}

const DefaultListEmptyState = () => (
  <Box sx={{ textAlign: 'center', py: 6 }}>
    <Typography variant="h6" fontWeight={600} gutterBottom>
      Aucune notification
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Les nouvelles alertes apparaîtront ici automatiquement.
    </Typography>
  </Box>
);

const DefaultActivityEmptyState = () => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Typography variant="body2" color="text.secondary">
      Aucun évènement récent pour le moment.
    </Typography>
  </Box>
);

export const NotificationCenter: FC<NotificationCenterProps> = ({
  overline,
  title,
  description,
  roleLabel,
  categories,
  stats,
  filters,
  filterValue,
  onFilterChange,
  visibility,
  onVisibilityChange,
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Filtrer par titre ou message',
  toolbarExtraFilters,
  toolbarActions,
  items,
  totalItemsCount,
  listTitle = 'Flux temps réel',
  listSubtitle,
  listEmptyState,
  onDismiss,
  onMarkAsRead,
  onMarkAllRead,
  onClearAll,
  activityItems,
  activityTitle = 'Journal de diffusion',
  activitySubtitle,
  activityEmptyState,
  categoriesTitle = 'Canaux & catégories',
  categoriesSubtitle,
  headActions,
}) => {
  const hasDefaultActions = Boolean(onMarkAllRead || onClearAll);

  const computedHeadActions = headActions
    ? headActions
    : hasDefaultActions && (
        <Stack direction="row" spacing={1}>
          {onMarkAllRead ? (
            <Button variant="outlined" startIcon={<DoneAllOutlinedIcon />} onClick={onMarkAllRead}>
              Tout marquer comme lu
            </Button>
          ) : null}
          {onClearAll ? (
            <Button variant="contained" color="error" startIcon={<ClearAllOutlinedIcon />} onClick={onClearAll}>
              Vider la liste
            </Button>
          ) : null}
        </Stack>
      );

  const computedListSubtitle = listSubtitle ?? `${items?.length ?? 0} notifications affichées`;
  const computedTotalCount = totalItemsCount ?? items?.length ?? 0;
  const computedToolbarActions = toolbarActions
    ? toolbarActions
    : visibility && onVisibilityChange
      ? <NotificationVisibilityToggle value={visibility} onChange={onVisibilityChange} />
      : null;
  const effectiveListEmptyState = listEmptyState ?? <DefaultListEmptyState />;
  const effectiveActivityEmptyState = activityEmptyState ?? <DefaultActivityEmptyState />;
  const computedCategoriesSubtitle =
    categoriesSubtitle ?? `Aperçu des alertes disponibles pour le rôle ${roleLabel.toLowerCase()}`;

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Box>
          {overline && (
            <Typography variant="overline" color="text.secondary">
              {overline}
            </Typography>
          )}
          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            gutterBottom
            sx={{ mt: overline ? 0.5 : 0 }}
          >
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Box>
        {computedHeadActions ?? null}
      </Stack>

      {stats && stats.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: 'repeat(auto-fit, minmax(220px, 1fr))' },
          }}
        >
          {stats.map((stat) => (
            <NotificationStatCard key={stat.label} {...stat} />
          ))}
        </Box>
      ) : null}

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        }}
      >
        <NotificationSectionCard
          title={listTitle}
          subtitle={computedListSubtitle}
          action={
            <Chip
              label={`${computedTotalCount} totales`}
              icon={<NotificationsActiveOutlinedIcon fontSize="small" />}
            />
          }
        >
          <Stack spacing={2}>
            {filters && filterValue && onFilterChange ? (
              <NotificationFilterToolbar
                filters={filters}
                value={filterValue}
                onChange={onFilterChange}
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                searchPlaceholder={searchPlaceholder}
                extraFilters={toolbarExtraFilters}
                actions={computedToolbarActions}
              />
            ) : null}

            {!items || items.length === 0 ? (
              effectiveListEmptyState
            ) : (
              <NotificationFeedList
                items={items}
                onDismiss={onDismiss}
                onMarkAsRead={onMarkAsRead}
              />
            )}
          </Stack>
        </NotificationSectionCard>

        <Stack spacing={3}>
          {activityItems ? (
            <NotificationSectionCard title={activityTitle} subtitle={activitySubtitle}>
              {activityItems.length > 0 ? (
                <NotificationActivityList items={activityItems} />
              ) : (
                effectiveActivityEmptyState
              )}
            </NotificationSectionCard>
          ) : null}

          <NotificationSectionCard title={categoriesTitle} subtitle={computedCategoriesSubtitle}>
            <Stack spacing={2}>
              {categories.map((category) => (
                <NotificationCategoryCard
                  key={category.id}
                  category={category}
                  roleLabel={roleLabel}
                />
              ))}
            </Stack>
          </NotificationSectionCard>
        </Stack>
      </Box>
    </Stack>
  );
};
