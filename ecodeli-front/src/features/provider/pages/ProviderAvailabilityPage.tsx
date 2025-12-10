import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import type { ProviderAvailabilitySlot } from '../types';
import { ProviderSectionCard } from '../components/ProviderSectionCard';
import { ProviderStatusChip } from '../components/ProviderStatusChip';

const initialAvailabilitySlots: ProviderAvailabilitySlot[] = [
  { id: '1', day: 'Lundi', startTime: '08:00', endTime: '18:00', status: 'AVAILABLE' },
  { id: '2', day: 'Mardi', startTime: '08:00', endTime: '16:00', status: 'AVAILABLE' },
  { id: '3', day: 'Mercredi', startTime: '-', endTime: '-', status: 'UNAVAILABLE' },
  { id: '4', day: 'Jeudi', startTime: '09:00', endTime: '19:00', status: 'AVAILABLE' },
  { id: '5', day: 'Vendredi', startTime: '07:00', endTime: '12:00', status: 'AVAILABLE' },
  { id: '6', day: 'Samedi', startTime: '09:00', endTime: '13:00', status: 'AVAILABLE' },
];

const daysOptions = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

type SlotStatus = ProviderAvailabilitySlot['status'];

interface AvailabilityFormState {
  day: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
}

const createDefaultSlot = (): AvailabilityFormState => ({
  day: 'Lundi',
  startTime: '08:00',
  endTime: '17:00',
  status: 'AVAILABLE',
});

const getTimeLabel = (value: string, fallback = '-') => (value.trim() ? value : fallback);

type CalendarProvider = 'GOOGLE' | 'OUTLOOK' | 'ICS';

interface CalendarSyncFormState {
  provider: CalendarProvider;
  includeExisting: boolean;
  includeFutureWeeks: number;
  icsUrl: string;
}

const createDefaultCalendarSyncForm = (): CalendarSyncFormState => ({
  provider: 'GOOGLE',
  includeExisting: true,
  includeFutureWeeks: 4,
  icsUrl: '',
});

const calendarProviderLabel: Record<CalendarProvider, string> = {
  GOOGLE: 'Google Calendar',
  OUTLOOK: 'Outlook / Office 365',
  ICS: 'Flux ICS personnalisé',
};

export const ProviderAvailabilityPage = () => {
  const [slots, setSlots] = useState<ProviderAvailabilitySlot[]>(initialAvailabilitySlots);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState<AvailabilityFormState>(createDefaultSlot);
  const [formAttempted, setFormAttempted] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [calendarForm, setCalendarForm] = useState<CalendarSyncFormState>(
    createDefaultCalendarSyncForm
  );
  const [calendarAttempted, setCalendarAttempted] = useState(false);
  const [lastSync, setLastSync] = useState<{ provider: CalendarProvider; when: Date } | null>(null);

  const requiresTimeRange = formState.status === 'AVAILABLE';
  const hasTimeInconsistency = useMemo(() => {
    if (!requiresTimeRange) {
      return false;
    }
    if (!formState.startTime || !formState.endTime) {
      return false;
    }
    return formState.startTime >= formState.endTime;
  }, [formState.endTime, formState.startTime, requiresTimeRange]);

  const isFormValid = useMemo(() => {
    if (!formState.day || !formState.status) {
      return false;
    }
    if (!requiresTimeRange) {
      return true;
    }
    return Boolean(formState.startTime && formState.endTime && !hasTimeInconsistency);
  }, [formState.day, formState.endTime, formState.startTime, formState.status, hasTimeInconsistency, requiresTimeRange]);

  const handleOpenDialog = () => {
    setFormState(createDefaultSlot());
    setFormAttempted(false);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleInputChange = (field: keyof AvailabilityFormState) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSelectChange = (field: keyof AvailabilityFormState) => (
    event: SelectChangeEvent
  ) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value as SlotStatus | string }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormAttempted(true);
    if (!isFormValid) {
      return;
    }

    const newSlot: ProviderAvailabilitySlot = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      day: formState.day,
      startTime: requiresTimeRange ? formState.startTime : '-',
      endTime: requiresTimeRange ? formState.endTime : '-',
      status: formState.status,
    };
    setSlots((prev) => [...prev, newSlot]);
    setIsDialogOpen(false);
  };

  const needsIcsUrl = calendarForm.provider === 'ICS';
  const isCalendarFormValid = needsIcsUrl ? Boolean(calendarForm.icsUrl.trim()) : true;

  const handleOpenSyncDialog = () => {
    setCalendarForm(createDefaultCalendarSyncForm());
    setCalendarAttempted(false);
    setIsSyncDialogOpen(true);
  };

  const handleCloseSyncDialog = () => {
    setIsSyncDialogOpen(false);
  };

  const handleCalendarProviderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const provider = event.target.value as CalendarProvider;
    setCalendarForm((prev) => ({
      ...prev,
      provider,
      icsUrl: provider === 'ICS' ? prev.icsUrl : '',
    }));
  };

  const handleCalendarSwitchChange = (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setCalendarForm((prev) => ({ ...prev, includeExisting: checked }));
  };

  const handleCalendarWeeksChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCalendarForm((prev) => ({ ...prev, includeFutureWeeks: Number(event.target.value) }));
  };

  const handleCalendarUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCalendarForm((prev) => ({ ...prev, icsUrl: event.target.value }));
  };

  const handleCalendarSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCalendarAttempted(true);
    if (!isCalendarFormValid) {
      return;
    }
    setLastSync({ provider: calendarForm.provider, when: new Date() });
    setIsSyncDialogOpen(false);
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
        <div>
          <Typography variant="h5" fontWeight={700}>
            Disponibilités
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Paramétrez vos créneaux hebdomadaires pour recevoir les bonnes missions.
          </Typography>
        </div>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<SyncAltOutlinedIcon />}
            onClick={handleOpenSyncDialog}
          >
            Synchroniser un calendrier
          </Button>
          <Button variant="contained" startIcon={<AddCircleOutlineOutlinedIcon />} onClick={handleOpenDialog}>
            Ajouter un créneau
          </Button>
        </Stack>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          alignItems: 'stretch',
        }}
      >
        <ProviderSectionCard
          title="Calendrier hebdomadaire"
          subtitle="Vos créneaux récurrents (modifiables à tout moment)"
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Jour</TableCell>
                  <TableCell>Début</TableCell>
                  <TableCell>Fin</TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{slot.day}</Typography>
                    </TableCell>
                    <TableCell>{getTimeLabel(slot.startTime)}</TableCell>
                    <TableCell>{getTimeLabel(slot.endTime)}</TableCell>
                    <TableCell>
                      <ProviderStatusChip status={slot.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ProviderSectionCard>

        <ProviderSectionCard title="Synthèse" subtitle="Basée sur les prochains 14 jours">
          <Stack spacing={2}>
            {lastSync ? (
              <Alert severity="success" variant="outlined">
                Synchronisé avec {calendarProviderLabel[lastSync.provider]} le{' '}
                {new Intl.DateTimeFormat('fr-FR', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(lastSync.when)}
              </Alert>
            ) : (
              <Alert severity="info" variant="outlined">
                Connectez votre calendrier pour bloquer automatiquement vos indisponibilités.
              </Alert>
            )}
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Couverts</Typography>
              <Typography fontWeight={700}>42 h</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Créneaux disponibles</Typography>
              <Typography fontWeight={700}>5 / 6 jours</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">Périodes critiques</Typography>
              <Typography fontWeight={700}>Vendredi matin</Typography>
            </Stack>
          </Stack>
        </ProviderSectionCard>
      </Box>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <DialogTitle>Ajouter un créneau</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <FormControl fullWidth required>
                <InputLabel id="slot-day-label">Jour</InputLabel>
                <Select
                  labelId="slot-day-label"
                  label="Jour"
                  value={formState.day}
                  onChange={handleSelectChange('day')}
                >
                  {daysOptions.map((day) => (
                    <MenuItem value={day} key={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required>
                <InputLabel id="slot-status-label">Statut</InputLabel>
                <Select
                  labelId="slot-status-label"
                  label="Statut"
                  value={formState.status}
                  onChange={handleSelectChange('status')}
                >
                  <MenuItem value="AVAILABLE">Disponible</MenuItem>
                  <MenuItem value="UNAVAILABLE">Indisponible</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Heure de début"
                type="time"
                value={formState.startTime}
                onChange={handleInputChange('startTime')}
                InputLabelProps={{ shrink: true }}
                required={requiresTimeRange}
                disabled={!requiresTimeRange}
                error={
                  requiresTimeRange &&
                  formAttempted &&
                  (!formState.startTime || hasTimeInconsistency)
                }
                helperText={
                  !requiresTimeRange
                    ? 'Le créneau est déclaré indisponible.'
                    : formAttempted && !formState.startTime
                      ? 'Indiquez une heure de début.'
                      : undefined
                }
              />

              <TextField
                label="Heure de fin"
                type="time"
                value={formState.endTime}
                onChange={handleInputChange('endTime')}
                InputLabelProps={{ shrink: true }}
                required={requiresTimeRange}
                disabled={!requiresTimeRange}
                error={
                  requiresTimeRange &&
                  formAttempted &&
                  (!formState.endTime || hasTimeInconsistency)
                }
                helperText={
                  !requiresTimeRange
                    ? undefined
                    : hasTimeInconsistency
                      ? 'L\'heure de fin doit être postérieure au début.'
                      : formAttempted && !formState.endTime
                        ? 'Indiquez une heure de fin.'
                        : undefined
                }
              />

              {!requiresTimeRange && (
                <FormHelperText>
                  Ce créneau sera marqué comme indisponible sur la période sélectionnée.
                </FormHelperText>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button type="submit" variant="contained" disabled={!isFormValid}>
              Ajouter
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={isSyncDialogOpen} onClose={handleCloseSyncDialog} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleCalendarSubmit} noValidate>
          <DialogTitle>Synchroniser un calendrier</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  Choisissez une source
                </Typography>
                <RadioGroup
                  value={calendarForm.provider}
                  onChange={handleCalendarProviderChange}
                >
                  <FormControlLabel value="GOOGLE" control={<Radio />} label="Google Calendar" />
                  <FormControlLabel value="OUTLOOK" control={<Radio />} label="Outlook / Office 365" />
                  <FormControlLabel value="ICS" control={<Radio />} label="Flux ICS personnalisé" />
                </RadioGroup>
              </Stack>

              {needsIcsUrl && (
                <TextField
                  label="URL ICS"
                  placeholder="https://exemple.com/calendar.ics"
                  value={calendarForm.icsUrl}
                  onChange={handleCalendarUrlChange}
                  required
                  error={calendarAttempted && !calendarForm.icsUrl.trim()}
                  helperText={
                    calendarAttempted && !calendarForm.icsUrl.trim()
                      ? 'Collez une URL valide vers votre flux ICS.'
                      : 'Les créneaux seront importés depuis ce flux sécurisé.'
                  }
                />
              )}

              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={calendarForm.includeExisting}
                      onChange={handleCalendarSwitchChange}
                    />
                  }
                  label="Importer les indisponibilités déjà présentes"
                />
                <TextField
                  label="Projection (semaines)"
                  type="number"
                  inputProps={{ min: 1, max: 12 }}
                  value={calendarForm.includeFutureWeeks}
                  onChange={handleCalendarWeeksChange}
                  helperText="Détermine combien de semaines à venir seront importées."
                />
              </Stack>

              <Alert severity="info" variant="outlined">
                La connexion se fait côté serveur via OAuth sécurisé. Une fois validée, vos
                créneaux seront mis à jour toutes les heures automatiquement.
              </Alert>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSyncDialog}>Annuler</Button>
            <Button type="submit" variant="contained" disabled={!isCalendarFormValid}>
              Connecter
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
};
