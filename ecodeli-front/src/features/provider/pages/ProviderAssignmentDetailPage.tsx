import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProviderSectionCard } from '../components/ProviderSectionCard';
import { ProviderStatusChip } from '../components/ProviderStatusChip';
import { providerAssignmentsMock } from '../data/providerAssignmentsMock';

const formatDateTime = (value?: string) => {
  if (!value) {
    return 'Non precise';
  }
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

export const ProviderAssignmentDetailPage = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();

  const assignment = useMemo(
    () => providerAssignmentsMock.find((item) => item.id === assignmentId),
    [assignmentId]
  );

  if (!assignment) {
    return (
      <Stack spacing={3} alignItems="flex-start">
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={() => navigate('/provider/assignments')}>
          Retour aux missions
        </Button>
        <Alert severity="warning" variant="outlined">
          Mission introuvable. Elle a peut-etre ete archivee ou vous n'y avez plus acces.
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Button startIcon={<ArrowBackIosNewIcon />} onClick={() => navigate('/provider/assignments')}>
        Retour aux missions
      </Button>

      <ProviderSectionCard title={assignment.title} subtitle={`Mission #${assignment.id}`}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box flex={1}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Statut actuel
              </Typography>
              <ProviderStatusChip status={assignment.status} />
              <Typography variant="body2" color="text.secondary">
                {assignment.description}
              </Typography>
            </Stack>
          </Box>
          <Box flex={1}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Details logistiques
              </Typography>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ScheduleOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={assignment.scheduledAt}
                    secondary={`Fenetre: ${formatDateTime(assignment.timeWindow?.start)} ➝ ${formatDateTime(assignment.timeWindow?.end)}`}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <PlaceOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={assignment.location} secondary={assignment.clientName} />
                </ListItem>
              </List>
            </Stack>
          </Box>
        </Stack>
      </ProviderSectionCard>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box flex={1}>
          <ProviderSectionCard title="Contact" subtitle="Dispatch ou point de collecte">
            <Stack spacing={1}>
              <Typography variant="body1" fontWeight={600}>
                {assignment.contact?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {assignment.contact?.company ?? assignment.clientName}
              </Typography>
              <Typography variant="body2">{assignment.contact?.phone}</Typography>
              {assignment.contact?.email && (
                <Typography variant="body2" color="text.secondary">
                  {assignment.contact.email}
                </Typography>
              )}
            </Stack>
          </ProviderSectionCard>
        </Box>
        <Box flex={1}>
          <ProviderSectionCard title="Chargement" subtitle="Exigences materiel">
            <Stack spacing={1.5}>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AssignmentOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={assignment.payload?.type ?? 'Chargement non precise'}
                    secondary={`${assignment.payload?.volume ?? ''} ${assignment.payload?.weight ?? ''}`.trim()}
                  />
                </ListItem>
              </List>
              {assignment.requirements?.length ? (
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {assignment.requirements.map((rule) => (
                    <Chip key={rule} label={rule} color="default" variant="outlined" />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Aucune exigence particuliere.
                </Typography>
              )}
            </Stack>
          </ProviderSectionCard>
        </Box>
      </Stack>

      {assignment.notes?.length ? (
        <ProviderSectionCard title="Notes terrain" subtitle="A partager avec le dispatch">
          <Stack spacing={1.5}>
            {assignment.notes.map((note) => (
              <Box key={note}>
                <Typography variant="body2">{note}</Typography>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </Stack>
        </ProviderSectionCard>
      ) : null}
    </Stack>
  );
};
