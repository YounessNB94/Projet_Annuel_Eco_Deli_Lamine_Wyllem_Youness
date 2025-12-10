import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type SyntheticEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  type AlertColor,
  type SelectChangeEvent,
} from '@mui/material';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useAuth } from '../../auth/context/AuthContext';
import type { ProviderAssignment } from '../types';
import { ProviderSectionCard } from '../components/ProviderSectionCard';
import { ProviderStatusChip } from '../components/ProviderStatusChip';
import {
  confirmProviderAssignment,
  createProviderUnavailability,
  type ProviderAssignmentConfirmationPayload,
  type ProviderUnavailabilityRecurrence,
} from '../api/providerAssignments';
import { providerAssignmentsMock } from '../data/providerAssignmentsMock';

const assignmentSummaries: ProviderAssignment[] = providerAssignmentsMock.map(
  ({ id, title, clientName, scheduledAt, location, status, payout }) => ({
    id,
    title,
    clientName,
    scheduledAt,
    location,
    status,
    payout,
  })
);

interface UnavailabilityFormState {
  startAt: string;
  endAt: string;
  reason: string;
  recurrence: ProviderUnavailabilityRecurrence;
}

interface ConfirmationFormState {
  assignmentId: string;
  message: string;
  eta: string;
}

const formatDateTimeLocalValue = (date: Date) => {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
};

const createDefaultUnavailabilityForm = (): UnavailabilityFormState => {
  const startAt = new Date();
  const endAt = new Date(startAt.getTime() + 60 * 60 * 1000);

  return {
    startAt: formatDateTimeLocalValue(startAt),
    endAt: formatDateTimeLocalValue(endAt),
    reason: '',
    recurrence: 'NONE',
  };
};

const createDefaultConfirmationForm = (): ConfirmationFormState => ({
  assignmentId: '',
  message: '',
  eta: '',
});

type FeedbackState = { message: string; severity: AlertColor } | null;

export const ProviderAssignmentsPage = () => {
  const navigate = useNavigate();
    const { user } = useAuth();
    const providerId = user?.id ?? 'provider-demo-1';
  const [rows, setRows] = useState<ProviderAssignment[]>(assignmentSummaries);
    const pendingAssignments = useMemo(
      () => rows.filter((assignment) => assignment.status === 'PENDING'),
      [rows]
    );
    const [isUnavailabilityDialogOpen, setIsUnavailabilityDialogOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [unavailabilityForm, setUnavailabilityForm] = useState<UnavailabilityFormState>(
      createDefaultUnavailabilityForm
    );
    const [confirmationForm, setConfirmationForm] = useState<ConfirmationFormState>(
      createDefaultConfirmationForm
    );
    const [unavailabilityAttempted, setUnavailabilityAttempted] = useState(false);
    const [confirmationAttempted, setConfirmationAttempted] = useState(false);
    const [unavailabilitySubmitting, setUnavailabilitySubmitting] = useState(false);
    const [confirmationSubmitting, setConfirmationSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackState>(null);

    const hasChronologyError = Boolean(
      unavailabilityForm.startAt &&
        unavailabilityForm.endAt &&
        unavailabilityForm.endAt <= unavailabilityForm.startAt
    );
    const isUnavailabilityFormValid = Boolean(
      unavailabilityForm.startAt && unavailabilityForm.endAt && !hasChronologyError
    );
    const isConfirmationFormValid = Boolean(confirmationForm.assignmentId);

    const handleOpenUnavailabilityDialog = () => {
      setUnavailabilityForm(createDefaultUnavailabilityForm());
      setUnavailabilityAttempted(false);
      setIsUnavailabilityDialogOpen(true);
    };

    const handleCloseUnavailabilityDialog = () => {
      if (unavailabilitySubmitting) {
        return;
      }
      setIsUnavailabilityDialogOpen(false);
    };

    const handleOpenConfirmDialog = (assignmentId?: string) => {
      setConfirmationForm((current) => {
        const hasStillSelected = pendingAssignments.some(
          (pending) => pending.id === current.assignmentId
        );
        return {
          assignmentId:
            assignmentId ?? (hasStillSelected ? current.assignmentId : undefined) ?? pendingAssignments[0]?.id ?? '',
          message: '',
          eta: '',
        };
      });
      setConfirmationAttempted(false);
      setIsConfirmDialogOpen(true);
    };

    const handleCloseConfirmDialog = () => {
      if (confirmationSubmitting) {
        return;
      }
      setIsConfirmDialogOpen(false);
    };

    const handleUnavailabilityChange = (field: keyof UnavailabilityFormState) => (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setUnavailabilityForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleUnavailabilityRecurrenceChange = (event: SelectChangeEvent) => {
      setUnavailabilityForm((prev) => ({
        ...prev,
        recurrence: event.target.value as ProviderUnavailabilityRecurrence,
      }));
    };

    const handleConfirmationChange = (field: keyof ConfirmationFormState) => (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setConfirmationForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleConfirmationAssignmentChange = (event: SelectChangeEvent) => {
      setConfirmationForm((prev) => ({ ...prev, assignmentId: event.target.value }));
    };

    const handleSubmitUnavailability = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setUnavailabilityAttempted(true);
      if (!isUnavailabilityFormValid) {
        return;
      }
      try {
        setUnavailabilitySubmitting(true);
        await createProviderUnavailability(providerId, {
          startAt: new Date(unavailabilityForm.startAt).toISOString(),
          endAt: new Date(unavailabilityForm.endAt).toISOString(),
          reason: unavailabilityForm.reason.trim() || undefined,
          recurrence:
            unavailabilityForm.recurrence === 'NONE' ? undefined : unavailabilityForm.recurrence,
        });
        setFeedback({ severity: 'success', message: 'Indisponibilité enregistrée.' });
        setIsUnavailabilityDialogOpen(false);
      } catch (error) {
        console.error(error);
        setFeedback({ severity: 'error', message: 'Impossible de planifier cette indisponibilité.' });
      } finally {
        setUnavailabilitySubmitting(false);
      }
    };

    const handleSubmitConfirmation = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setConfirmationAttempted(true);
      if (!isConfirmationFormValid) {
        return;
      }
      const targetAssignmentId = confirmationForm.assignmentId;
      try {
        setConfirmationSubmitting(true);
        const payload: ProviderAssignmentConfirmationPayload = {
          message: confirmationForm.message.trim() || undefined,
          eta: confirmationForm.eta ? new Date(confirmationForm.eta).toISOString() : undefined,
        };
        await confirmProviderAssignment(targetAssignmentId, payload);
        setRows((prev) =>
          prev.map((assignment) =>
            assignment.id === targetAssignmentId
              ? { ...assignment, status: 'CONFIRMED' }
              : assignment
          )
        );
        setFeedback({ severity: 'success', message: `Mission ${targetAssignmentId} confirmée.` });
        setIsConfirmDialogOpen(false);
      } catch (error) {
        console.error(error);
        setFeedback({ severity: 'error', message: 'La confirmation de mission a échoué.' });
      } finally {
        setConfirmationSubmitting(false);
      }
    };

    const handleCloseFeedback = (
      _event?: SyntheticEvent | Event,
      reason?: string
    ) => {
      if (reason === 'clickaway') {
        return;
      }
      setFeedback(null);
    };

    return (
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Missions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Suivez l’avancement de vos prestations et mettez à jour les statuts.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<EditCalendarOutlinedIcon />}
              onClick={handleOpenUnavailabilityDialog}
            >
              Planifier une indisponibilité
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckCircleOutlineOutlinedIcon />}
              onClick={() => handleOpenConfirmDialog()}
              disabled={!pendingAssignments.length}
            >
              Confirmer une mission
            </Button>
          </Stack>
        </Stack>

        <ProviderSectionCard title="Vue détaillée" subtitle="Historique des 30 derniers jours">
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Mission</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Lieu</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Gain</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((assignment) => (
                  <TableRow key={assignment.id} hover>
                    <TableCell>
                      <Stack>
                        <Typography fontWeight={600}>{assignment.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          #{assignment.id}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{assignment.clientName}</TableCell>
                    <TableCell>{assignment.scheduledAt}</TableCell>
                    <TableCell>{assignment.location}</TableCell>
                    <TableCell>
                      <ProviderStatusChip status={assignment.status} />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {assignment.payout.toFixed(0)} €
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Afficher les détails">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/provider/assignments/${assignment.id}`)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {assignment.status === 'PENDING' && (
                          <Tooltip title="Confirmer cette mission">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleOpenConfirmDialog(assignment.id)}
                            >
                              <CheckCircleOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ProviderSectionCard>

        <Dialog
          fullWidth
          maxWidth="sm"
          open={isUnavailabilityDialogOpen}
          onClose={handleCloseUnavailabilityDialog}
        >
          <Box component="form" onSubmit={handleSubmitUnavailability} noValidate>
            <DialogTitle>Planifier une indisponibilité</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <TextField
                  label="Début"
                  type="datetime-local"
                  value={unavailabilityForm.startAt}
                  onChange={handleUnavailabilityChange('startAt')}
                  InputLabelProps={{ shrink: true }}
                  required
                  error={unavailabilityAttempted && !unavailabilityForm.startAt}
                  helperText={
                    unavailabilityAttempted && !unavailabilityForm.startAt
                      ? 'Indiquez une date de début.'
                      : undefined
                  }
                />
                <TextField
                  label="Fin"
                  type="datetime-local"
                  value={unavailabilityForm.endAt}
                  onChange={handleUnavailabilityChange('endAt')}
                  InputLabelProps={{ shrink: true }}
                  required
                  error={(unavailabilityAttempted && !unavailabilityForm.endAt) || hasChronologyError}
                  helperText={
                    hasChronologyError
                      ? 'La date de fin doit être postérieure au début.'
                      : unavailabilityAttempted && !unavailabilityForm.endAt
                        ? 'Indiquez une date de fin.'
                        : undefined
                  }
                />
                <TextField
                  label="Motif (optionnel)"
                  placeholder="Congés, visite médicale, panne, ..."
                  multiline
                  minRows={2}
                  value={unavailabilityForm.reason}
                  onChange={handleUnavailabilityChange('reason')}
                />
                <FormControl fullWidth>
                  <InputLabel id="unavailability-recurrence-label">Répétition</InputLabel>
                  <Select
                    labelId="unavailability-recurrence-label"
                    label="Répétition"
                    value={unavailabilityForm.recurrence}
                    onChange={handleUnavailabilityRecurrenceChange}
                  >
                    <MenuItem value="NONE">Aucune</MenuItem>
                    <MenuItem value="DAILY">Tous les jours</MenuItem>
                    <MenuItem value="WEEKLY">Chaque semaine</MenuItem>
                    <MenuItem value="MONTHLY">Chaque mois</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUnavailabilityDialog} disabled={unavailabilitySubmitting}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!isUnavailabilityFormValid || unavailabilitySubmitting}
              >
                {unavailabilitySubmitting ? 'Enregistrement…' : 'Enregistrer'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        <Dialog fullWidth maxWidth="sm" open={isConfirmDialogOpen} onClose={handleCloseConfirmDialog}>
          <Box component="form" onSubmit={handleSubmitConfirmation} noValidate>
            <DialogTitle>Confirmer une mission</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <FormControl fullWidth required>
                  <InputLabel id="confirm-assignment-label">Mission</InputLabel>
                  <Select
                    labelId="confirm-assignment-label"
                    label="Mission"
                    value={confirmationForm.assignmentId}
                    onChange={handleConfirmationAssignmentChange}
                    error={confirmationAttempted && !confirmationForm.assignmentId}
                    disabled={!pendingAssignments.length}
                  >
                    {pendingAssignments.map((assignment) => (
                      <MenuItem key={assignment.id} value={assignment.id}>
                        #{assignment.id} — {assignment.title}
                      </MenuItem>
                    ))}
                    {!pendingAssignments.length && (
                      <MenuItem disabled value="">
                        Aucune mission en attente
                      </MenuItem>
                    )}
                  </Select>
                  {!pendingAssignments.length && (
                    <FormHelperText>Aucune mission en statut PENDING.</FormHelperText>
                  )}
                </FormControl>
                <TextField
                  label="Message (optionnel)"
                  placeholder="Confirmation envoyée au dispatch"
                  multiline
                  minRows={3}
                  value={confirmationForm.message}
                  onChange={handleConfirmationChange('message')}
                />
                <TextField
                  label="ETA ou heure estimée (optionnel)"
                  type="datetime-local"
                  value={confirmationForm.eta}
                  onChange={handleConfirmationChange('eta')}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDialog} disabled={confirmationSubmitting}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!isConfirmationFormValid || confirmationSubmitting}
              >
                {confirmationSubmitting ? 'Confirmation…' : 'Confirmer'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        <Snackbar
          autoHideDuration={4000}
          open={Boolean(feedback)}
          onClose={handleCloseFeedback}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          {feedback ? (
            <Alert onClose={handleCloseFeedback} severity={feedback.severity} variant="filled">
              {feedback.message}
            </Alert>
          ) : undefined}
        </Snackbar>
      </Stack>
    );
  };
