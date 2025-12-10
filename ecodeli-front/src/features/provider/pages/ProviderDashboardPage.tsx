import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Rating,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import { ProviderStatCard } from '../components/ProviderStatCard';
import { ProviderSectionCard } from '../components/ProviderSectionCard';
import { ProviderStatusChip } from '../components/ProviderStatusChip';
import type { ProviderAssignment, ProviderStat } from '../types';

const statCards: ProviderStat[] = [
  {
    label: 'Revenus du mois',
    value: '2 450 €',
    trend: { value: 12.6, direction: 'up', label: 'vs. mois dernier' },
    icon: <PaidOutlinedIcon fontSize="medium" />,
  },
  {
    label: 'Missions planifiées',
    value: '18',
    trend: { value: 4.1, direction: 'up' },
    icon: <AccessTimeOutlinedIcon fontSize="medium" />,
  },
  {
    label: 'Note moyenne',
    value: '4.8/5',
    trend: { value: 0.4, direction: 'up', label: '30 derniers jours' },
    icon: <ReviewsOutlinedIcon fontSize="medium" />,
  },
  {
    label: 'Taux d’acceptation',
    value: '96%',
    trend: { value: 1.5, direction: 'flat', label: 'stable' },
    icon: <TrendingUpOutlinedIcon fontSize="medium" />,
  },
];

const upcomingAssignments: ProviderAssignment[] = [
  {
    id: '1',
    title: 'Livraison récurrente BioMarché',
    clientName: 'BioMarché Lyon',
    scheduledAt: '11 déc. • 08:30',
    location: 'Lyon 2e',
    status: 'CONFIRMED',
    payout: 140,
  },
  {
    id: '2',
    title: 'Collecte hebdo partenaires',
    clientName: 'EcoDeli Pro',
    scheduledAt: '12 déc. • 14:00',
    location: 'Villeurbanne',
    status: 'PENDING',
    payout: 95,
  },
  {
    id: '3',
    title: 'Tournée express centre-ville',
    clientName: 'Camille L.',
    scheduledAt: '13 déc. • 10:00',
    location: 'Lyon 1er',
    status: 'IN_PROGRESS',
    payout: 120,
  },
];

const recentEvaluations = [
  {
    id: '1',
    clientName: 'Maison Varela',
    score: 5,
    comment: 'Ponctualité parfaite et tenue impeccable. Merci !',
    completedAt: 'Hier',
    completedAtDate: '2025-12-09',
    missionType: 'Livraison urbaine',
  },
  {
    id: '2',
    clientName: 'Green & Co',
    score: 4,
    comment: 'Livraison rapide, un petit retard de 5 minutes.',
    completedAt: '08 déc.',
    completedAtDate: '2025-12-08',
    missionType: 'Collecte et recyclage',
  },
  {
    id: '3',
    clientName: 'Les Vergers Bio',
    score: 5,
    comment: 'Toujours très professionnel, continuez ainsi.',
    completedAt: '06 déc.',
    completedAtDate: '2025-12-06',
    missionType: 'Services à domicile',
  },
];

const reviewSummary = {
  averageScore: 4.8,
  totalReviews: 142,
  trendValue: 0.3,
  trendLabel: 'vs. 30 derniers jours',
};

const reviewDistribution = [
  { score: 5, percentage: 68 },
  { score: 4, percentage: 22 },
  { score: 3, percentage: 7 },
  { score: 2, percentage: 2 },
  { score: 1, percentage: 1 },
];

const reviewKeywords = [
  { label: 'Ponctualité', occurrences: 24 },
  { label: 'Communication', occurrences: 18 },
  { label: 'Propreté', occurrences: 11 },
  { label: 'Amabilité', occurrences: 9 },
  { label: 'Flexibilité', occurrences: 7 },
];

const REVIEW_PERIOD_OPTIONS = ['7 jours', '30 jours', '90 jours'];
const REVIEW_MISSION_TYPES = [
  'Tous',
  'Livraison urbaine',
  'Services à domicile',
  'Soins personnels',
  'Collecte et recyclage',
  'Support administratif',
];

const getDaysFromPeriod = (period: string) => {
  switch (period) {
    case '7 jours':
      return 7;
    case '30 jours':
      return 30;
    case '90 jours':
      return 90;
    default:
      return 30;
  }
};

const availabilitySummary = [
  { day: 'Lundi', slots: '08:00 – 18:00', status: 'Disponible' },
  { day: 'Mardi', slots: '08:00 – 16:00', status: 'Disponible' },
  { day: 'Mercredi', slots: 'Indisponible', status: 'En pause' },
  { day: 'Jeudi', slots: '09:00 – 19:00', status: 'Disponible' },
  { day: 'Vendredi', slots: '07:00 – 12:00', status: 'Disponible' },
];

export const ProviderDashboardPage = () => {
  const [isCalendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [isReviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(REVIEW_PERIOD_OPTIONS[1]);
  const [selectedMissionType, setSelectedMissionType] = useState<string>('Tous');
  const [selectedClient, setSelectedClient] = useState<string>('Tous');

  const handleOpenCalendarDialog = () => setCalendarDialogOpen(true);
  const handleCloseCalendarDialog = () => setCalendarDialogOpen(false);
  const handleSaveCalendar = () => {
    // TODO: connecter aux préférences de disponibilité fournisseur
    setCalendarDialogOpen(false);
  };

  const handleOpenReviewsDialog = () => setReviewsDialogOpen(true);
  const handleCloseReviewsDialog = () => setReviewsDialogOpen(false);

  const handlePeriodChange = (event: SelectChangeEvent<string>) => setSelectedPeriod(event.target.value);
  const handleMissionTypeChange = (event: SelectChangeEvent<string>) =>
    setSelectedMissionType(event.target.value);
  const handleClientChange = (event: SelectChangeEvent<string>) => setSelectedClient(event.target.value);

  const clientFilterOptions = useMemo(
    () => ['Tous', ...new Set(recentEvaluations.map((evaluation) => evaluation.clientName))],
    []
  );

  const filteredEvaluations = useMemo(() => {
    const now = Date.now();
    const periodMs = getDaysFromPeriod(selectedPeriod) * 24 * 60 * 60 * 1000;

    return recentEvaluations.filter((evaluation) => {
      const matchesMissionType =
        selectedMissionType === 'Tous' || evaluation.missionType === selectedMissionType;
      const matchesClient = selectedClient === 'Tous' || evaluation.clientName === selectedClient;
      const evaluationMs = new Date(evaluation.completedAtDate).getTime();
      const matchesPeriod = now - evaluationMs <= periodMs;
      return matchesMissionType && matchesClient && matchesPeriod;
    });
  }, [selectedClient, selectedMissionType, selectedPeriod]);

  return (
    <>
      <Stack spacing={3}>
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
      }}
    >
      {statCards.map((stat) => (
        <Box key={stat.label}>
          <ProviderStatCard {...stat} />
        </Box>
      ))}
    </Box>

    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        alignItems: 'stretch',
      }}
    >
      <ProviderSectionCard
        title="Missions à venir"
        subtitle="Vos trois prochaines interventions confirmées"
        action={
          <Button size="small" component={RouterLink} to="/provider/assignments" sx={{ textTransform: 'none' }}>
            Voir toutes
          </Button>
        }
      >
        <List disablePadding>
          {upcomingAssignments.map((assignment, index) => (
            <Box key={assignment.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  disableTypography
                  primary={
                    <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
                      <Typography variant="subtitle1" fontWeight={600}>
                        {assignment.title}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {assignment.scheduledAt}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Stack spacing={1} mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        {assignment.clientName} • {assignment.location}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ProviderStatusChip status={assignment.status} />
                        <Typography variant="body2" fontWeight={600}>
                          {assignment.payout.toFixed(0)} €
                        </Typography>
                      </Stack>
                    </Stack>
                  }
                />
              </ListItem>
              {index < upcomingAssignments.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      </ProviderSectionCard>

      <ProviderSectionCard
        title="Dernières évaluations"
        subtitle="Synthèse des retours clients"
        action={
          <Button size="small" onClick={handleOpenReviewsDialog} sx={{ textTransform: 'none' }}>
            Analyser
          </Button>
        }
      >
        <List disablePadding>
          {recentEvaluations.map((evaluation, index) => (
            <Box key={evaluation.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>{evaluation.clientName.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  primary={
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle1" fontWeight={600}>
                        {evaluation.clientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {evaluation.completedAt}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Stack spacing={1} mt={1}>
                      <Rating value={evaluation.score} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary">
                        {evaluation.comment}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Type de mission : {evaluation.missionType}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
              {index < recentEvaluations.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      </ProviderSectionCard>
    </Box>

    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
        alignItems: 'stretch',
      }}
    >
      <ProviderSectionCard
        title="Disponibilités de la semaine"
        subtitle="Pensez à mettre à jour vos créneaux en cas de changement"
        action={
          <Button size="small" onClick={handleOpenCalendarDialog} sx={{ textTransform: 'none' }}>
            Gérer le calendrier
          </Button>
        }
      >
        <Stack spacing={2}>
          {availabilitySummary.map((day) => (
            <Stack
              key={day.day}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'background.default',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="body1" fontWeight={600}>
                {day.day}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {day.slots}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {day.status}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </ProviderSectionCard>

      <ProviderSectionCard
        title="Suivi qualité"
        subtitle="Indicateurs clés sur les 30 derniers jours"
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="body2" color="text.secondary">
                Retours positifs
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                94%
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="body2" color="text.secondary">
                Incidents déclarés
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                1
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Dernière vérification de profil
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ProviderStatusChip status="APPROVED" />
              <Typography variant="body2" color="text.secondary">
                Mise à jour il y a 12 jours
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </ProviderSectionCard>
    </Box>
  </Stack>

      <Dialog open={isReviewsDialogOpen} onClose={handleCloseReviewsDialog} maxWidth="md" fullWidth>
        <DialogTitle>Analyse des évaluations</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Note moyenne
                </Typography>
                <Typography variant="h3" fontWeight={700}>
                  {reviewSummary.averageScore.toFixed(1)}/5
                </Typography>
                <Typography
                  variant="body2"
                  color={reviewSummary.trendValue >= 0 ? 'success.main' : 'error.main'}
                >
                  {reviewSummary.trendValue >= 0 ? '+' : ''}
                  {reviewSummary.trendValue.toFixed(1)} {reviewSummary.trendLabel}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Volume analysé
                </Typography>
                <Typography variant="h3" fontWeight={700}>
                  {reviewSummary.totalReviews}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Évaluations sur la période sélectionnée
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Répartition des notes
              </Typography>
              {reviewDistribution.map((item) => (
                <Stack key={item.score} spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">{item.score} ★</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.percentage}%
                    </Typography>
                  </Stack>
                  <LinearProgress value={item.percentage} variant="determinate" />
                </Stack>
              ))}
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Filtres
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Période</InputLabel>
                  <Select value={selectedPeriod} label="Période" onChange={handlePeriodChange}>
                    {REVIEW_PERIOD_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Type de mission</InputLabel>
                  <Select value={selectedMissionType} label="Type de mission" onChange={handleMissionTypeChange}>
                    {REVIEW_MISSION_TYPES.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Select value={selectedClient} label="Client" onChange={handleClientChange}>
                    {clientFilterOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Mots-clés fréquents
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {reviewKeywords.map((keyword) => (
                  <Chip key={keyword.label} label={`${keyword.label} (${keyword.occurrences})`} />
                ))}
              </Stack>
            </Stack>

            <Divider />

            <Stack spacing={2}>
              {filteredEvaluations.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Aucune évaluation ne correspond aux filtres sélectionnés.
                </Typography>
              )}
              {filteredEvaluations.map((evaluation) => (
                <Box
                  key={evaluation.id}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {evaluation.clientName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {evaluation.completedAt}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                    <Rating value={evaluation.score} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      {evaluation.missionType}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" mt={1}>
                    {evaluation.comment}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewsDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCalendarDialogOpen} onClose={handleCloseCalendarDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Gérer le calendrier</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} fullWidth />
            <TextField label="Créneaux disponibles" placeholder="Ex. 08:00 – 18:00" fullWidth />
            <TextField
              label="Notes"
              placeholder="Ajoutez un commentaire pour l'équipe planning"
              multiline
              minRows={3}
              fullWidth
            />
            <FormControlLabel control={<Switch defaultChecked />} label="Disponible ce jour" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCalendarDialog}>Annuler</Button>
          <Button variant="contained" onClick={handleSaveCalendar}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
