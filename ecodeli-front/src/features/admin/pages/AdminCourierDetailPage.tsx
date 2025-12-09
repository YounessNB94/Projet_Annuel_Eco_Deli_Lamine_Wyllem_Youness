import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

import { AdminSectionCard } from '../components/AdminSectionCard';
import { AdminStatusChip, type AdminStatus } from '../components/AdminStatusChip';
import { AdminInfoList } from '../components/AdminInfoList';
import { AdminDocumentList, type AdminDocumentItem } from '../components/AdminDocumentList';
import { AdminActivityList, type AdminActivityItem } from '../components/AdminActivityList';

interface CourierProfile {
  id: string;
  name: string;
  company: string;
  zone: string;
  level: 'Bronze' | 'Argent' | 'Or';
  status: AdminStatus;
  deliveries: number;
  rating: string;
  averageSla: string;
  contactEmail: string;
  contactPhone: string;
}

const courierProfiles: Record<string, CourierProfile> = {
  'CR-541': {
    id: 'CR-541',
    name: 'Nadia Benali',
    company: 'NB Logistics',
    zone: 'Paris Ouest',
    level: 'Argent',
    status: 'pending',
    deliveries: 482,
    rating: '4,8/5',
    averageSla: '92 min',
    contactEmail: 'nadia.benali@nb-log.fr',
    contactPhone: '+33 6 52 21 09 43',
  },
  'CR-536': {
    id: 'CR-536',
    name: 'Yohan Pereira',
    company: 'YP Services',
    zone: 'Lyon Centre',
    level: 'Bronze',
    status: 'review',
    deliveries: 205,
    rating: '4,2/5',
    averageSla: '104 min',
    contactEmail: 'contact@yp-services.fr',
    contactPhone: '+33 7 61 04 88 30',
  },
};

const documentsByCourier: Record<string, AdminDocumentItem[]> = {
  'CR-541': [
    {
      id: 'doc-1',
      title: 'Pièce d’identité',
      description: 'Carte nationale - recto/verso',
      meta: 'Ajouté le 09/12 à 09:12',
      status: { label: 'En revue manuelle', color: 'warning' },
      actions: (
        <>
          <Button size="small" startIcon={<VisibilityOutlinedIcon />}>
            Ouvrir
          </Button>
          <Button size="small" startIcon={<DownloadOutlinedIcon />}>Télécharger</Button>
        </>
      ),
    },
    {
      id: 'doc-2',
      title: 'Permis B',
      description: 'Validité jusqu’au 14/08/2027',
      meta: 'Contrôlé le 08/12 à 17:40',
      status: { label: 'Vérifié', color: 'success', variant: 'filled' },
      actions: (
        <Button size="small" startIcon={<DownloadOutlinedIcon />}>Télécharger</Button>
      ),
    },
    {
      id: 'doc-3',
      title: 'Assurance RC Pro',
      description: 'Attestation MAIF - couverture nationale',
      meta: 'Expiration dans 134 jours',
      status: { label: 'À renouveler bientôt', color: 'info' },
      actions: (
        <Button size="small" startIcon={<VisibilityOutlinedIcon />}>
          Aperçu
        </Button>
      ),
    },
  ],
  'CR-536': [
    {
      id: 'doc-4',
      title: 'Pièce d’identité',
      description: 'Passeport',
      meta: 'Ajouté le 06/12 à 15:04',
      status: { label: 'En attente', color: 'warning' },
    },
    {
      id: 'doc-5',
      title: 'Permis B',
      description: 'Validité jusqu’au 03/11/2025',
      meta: 'Contrôlé automatiquement',
      status: { label: 'Vérifié', color: 'success', variant: 'filled' },
    },
  ],
};

const activityByCourier: Record<string, AdminActivityItem[]> = {
  'CR-541': [
    {
      id: 'activity-1',
      title: 'Contrôle identité',
      description: 'Sarah P. a demandé une revue manuelle du verso.',
      timestamp: 'Il y a 12 min',
    },
    {
      id: 'activity-2',
      title: 'Permis validé',
      description: "Le permis B a été validé automatiquement (OCR).",
      timestamp: 'Hier 18:04',
    },
    {
      id: 'activity-3',
      title: 'Relance assurance',
      description: 'Notification programmée 30 jours avant expiration.',
      timestamp: 'Hier 09:20',
    },
  ],
  'CR-536': [
    {
      id: 'activity-4',
      title: 'Pièce identité importée',
      description: 'Document transmis par l’application mobile.',
      timestamp: 'Il y a 2 h',
    },
  ],
};

const FALLBACK_COURIER_ID = 'CR-541';

export const AdminCourierDetailPage = () => {
  const navigate = useNavigate();
  const { courierId } = useParams();
  const [reviewComment, setReviewComment] = useState('');

  const courier = useMemo(() => {
    const identifier = courierId ?? FALLBACK_COURIER_ID;
    return courierProfiles[identifier] ?? courierProfiles[FALLBACK_COURIER_ID];
  }, [courierId]);

  const documents = documentsByCourier[courier.id] ?? [];
  const activities = activityByCourier[courier.id] ?? [];

  const handleDecision = (decision: 'approve' | 'reject') => {
    console.info('Admin decision', { decision, courierId: courier.id, comment: reviewComment });
    setReviewComment('');
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Stack spacing={1}>
          <Button startIcon={<ArrowBackIcon />} variant="text" color="inherit" onClick={() => navigate(-1)}>
            Retour aux dossiers
          </Button>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight={700}>
                {courier.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {courier.company} • {courier.zone}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <AdminStatusChip status={courier.status} />
              <Chip label={`Niveau ${courier.level}`} variant="outlined" />
              <Chip label={`${courier.deliveries} livraisons`} icon={<ShieldOutlinedIcon fontSize="small" />} variant="outlined" />
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ForumOutlinedIcon />}>Contacter</Button>
          <Button variant="contained" color="success" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleDecision('approve')}>
            Validation rapide
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', xl: '2fr 1fr' },
        }}
      >
        <Stack spacing={3}>
          <AdminSectionCard title="Documents requis" subtitle="Contrôlez et annotez les fichiers transmis">
            <AdminDocumentList items={documents} />
          </AdminSectionCard>

          <AdminSectionCard title="Historique de validation" subtitle="Dernières actions et alertes">
            <AdminActivityList items={activities} />
          </AdminSectionCard>
        </Stack>

        <Stack spacing={3}>
          <AdminSectionCard title="Action backoffice" subtitle="Décision finale">
            <Stack spacing={2}>
              <TextField
                label="Commentaire interne"
                placeholder="Expliquez votre décision (visible par les managers backoffice)."
                multiline
                minRows={4}
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button fullWidth variant="outlined" color="error" startIcon={<HighlightOffOutlinedIcon />} onClick={() => handleDecision('reject')}>
                  Refuser le dossier
                </Button>
                <Button fullWidth variant="contained" color="success" startIcon={<CheckCircleOutlineIcon />} onClick={() => handleDecision('approve')}>
                  Approuver
                </Button>
              </Stack>
            </Stack>
          </AdminSectionCard>

          <AdminSectionCard title="Information coursier">
            <AdminInfoList
              columns={1}
              items={[
                { label: 'Identifiant dossier', value: courier.id },
                { label: 'Email', value: courier.contactEmail },
                { label: 'Téléphone', value: courier.contactPhone },
                { label: 'Niveau', value: courier.level },
                { label: 'Temps moyen de livraison', value: courier.averageSla },
                { label: 'Satisfaction clients', value: courier.rating },
              ]}
            />
          </AdminSectionCard>
        </Stack>
      </Box>
    </Stack>
  );
};
