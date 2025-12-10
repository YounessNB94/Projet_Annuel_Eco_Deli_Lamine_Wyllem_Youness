import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Button } from '@mui/material';

export type AdminCampaignFlowType = 'announcement' | 'delivery';

export interface CreateCampaignPayload {
  type: AdminCampaignFlowType;
  title: string;
  merchant: string;
  zones: string;
  date: string;
  slot: string;
  volume: number;
  couriers: number;
  slaTargetMin?: number;
}

interface AdminCreateCampaignDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateCampaignPayload) => void;
}

export const AdminCreateCampaignDialog = ({ open, onClose, onCreate }: AdminCreateCampaignDialogProps) => {
  const [formType, setFormType] = useState<AdminCampaignFlowType>('announcement');
  const [formTitle, setFormTitle] = useState('');
  const [formMerchant, setFormMerchant] = useState('');
  const [formZones, setFormZones] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formSlot, setFormSlot] = useState('');
  const [formVolume, setFormVolume] = useState<number | ''>('');
  const [formCouriers, setFormCouriers] = useState<number | ''>('');
  const [formSla, setFormSla] = useState<number | ''>('');

  const resetForm = () => {
    setFormType('announcement');
    setFormTitle('');
    setFormMerchant('');
    setFormZones('');
    setFormDate('');
    setFormSlot('');
    setFormVolume('');
    setFormCouriers('');
    setFormSla('');
  };

  const canSubmit =
    formTitle.trim() &&
    formMerchant.trim() &&
    formZones.trim() &&
    formDate.trim() &&
    formSlot.trim() &&
    typeof formVolume === 'number' && formVolume > 0 &&
    typeof formCouriers === 'number' && formCouriers > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate({
      type: formType,
      title: formTitle.trim(),
      merchant: formMerchant.trim(),
      zones: formZones.trim(),
      date: formDate.trim(),
      slot: formSlot.trim(),
      volume: Number(formVolume),
      couriers: Number(formCouriers),
      slaTargetMin: typeof formSla === 'number' && formSla > 0 ? formSla : undefined,
    });
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Nouvelle campagne</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              fullWidth
              label="Type"
              value={formType}
              onChange={(e) => setFormType(e.target.value as AdminCampaignFlowType)}
            >
              <MenuItem value="announcement">Annonce</MenuItem>
              <MenuItem value="delivery">Livraison</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Titre de l’opération"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Marchand"
              value={formMerchant}
              onChange={(e) => setFormMerchant(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Zones (séparées par virgules)"
              value={formZones}
              onChange={(e) => setFormZones(e.target.value)}
              placeholder="Paris 15, Issy, Boulogne"
              required
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Date (ex: 12 déc)"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Créneau (ex: 08h-13h)"
              value={formSlot}
              onChange={(e) => setFormSlot(e.target.value)}
              required
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              type="number"
              label="Volume (colis)"
              value={formVolume}
              onChange={(e) => setFormVolume(e.target.value === '' ? '' : Number(e.target.value))}
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Ressources / livreurs"
              value={formCouriers}
              onChange={(e) => setFormCouriers(e.target.value === '' ? '' : Number(e.target.value))}
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              fullWidth
              type="number"
              label="SLA cible (minutes)"
              value={formSla}
              onChange={(e) => setFormSla(e.target.value === '' ? '' : Number(e.target.value))}
              inputProps={{ min: 1 }}
            />
          </Stack>

        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Créer la campagne
        </Button>
      </DialogActions>
    </Dialog>
  );
}
