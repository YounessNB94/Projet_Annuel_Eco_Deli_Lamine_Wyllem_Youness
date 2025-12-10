import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import type { ProviderDocument } from '../types';
import { ProviderSectionCard } from '../components/ProviderSectionCard';
import { ProviderStatusChip } from '../components/ProviderStatusChip';

const initialDocuments: ProviderDocument[] = [
  { id: 'DOC-01', label: 'Pièce d’identité', lastUpdated: '02 nov. 2025', status: 'APPROVED' },
  { id: 'DOC-02', label: 'Justificatif de domicile', lastUpdated: '28 oct. 2025', status: 'UNDER_REVIEW' },
  { id: 'DOC-03', label: 'Assurance responsabilité civile', lastUpdated: '15 sept. 2025', status: 'EXPIRED' },
  { id: 'DOC-04', label: 'Kbis / SIREN', lastUpdated: '01 sept. 2025', status: 'APPROVED' },
];

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);

export const ProviderDocumentsPage = () => {
  const [documents, setDocuments] = useState<ProviderDocument[]>(initialDocuments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeDocument, setActiveDocument] = useState<ProviderDocument | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleOpenDialog = (doc: ProviderDocument) => {
    setActiveDocument(doc);
    setSelectedFile(null);
    setAttempted(false);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!uploading) {
      setIsDialogOpen(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] ?? null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    if (!selectedFile || !activeDocument) {
      return;
    }
    try {
      setUploading(true);
      // simulate upload latency
      await new Promise((resolve) => setTimeout(resolve, 600));
      const now = new Date();
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === activeDocument.id
            ? {
                ...doc,
                status: 'UNDER_REVIEW',
                lastUpdated: formatDate(now),
              }
            : doc
        )
      );
      setIsDialogOpen(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
        <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2} width="100%">
          <Typography variant="h5" fontWeight={700}>
            Documents & conformité
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mettez à jour vos pièces justificatives pour rester éligible aux nouvelles missions.
          </Typography>
        </Box>
      </Stack>

      <ProviderSectionCard title="Pièces requises" subtitle="Liste contrôlée par EcoDeli">
        <List>
          {documents.map((doc) => (
            <ListItem
              key={doc.id}
              divider
              secondaryAction={
                <Stack direction="row" spacing={1} alignItems="center">
                  <ProviderStatusChip status={doc.status} />
                  <Button size="small" onClick={() => handleOpenDialog(doc)}>
                    Mettre à jour
                  </Button>
                </Stack>
              }
            >
              <ListItemText
                primary={<Typography fontWeight={600}>{doc.label}</Typography>}
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    Mis à jour le {doc.lastUpdated}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </ProviderSectionCard>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <DialogTitle>
            Mettre à jour {activeDocument?.label ?? 'un document'}
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Déposez un PDF ou une photo claire. Nous vérifierons la conformité en moins de 24h.
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadOutlinedIcon />}
              >
                {selectedFile ? selectedFile.name : 'Choisir un fichier'}
                <input
                  hidden
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {attempted && !selectedFile ? (
                <Typography variant="caption" color="error">
                  Sélectionnez un fichier avant de valider.
                </Typography>
              ) : null}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={uploading}>
              Annuler
            </Button>
            <Button type="submit" variant="contained" disabled={uploading}>
              {uploading ? 'Téléversement…' : 'Envoyer'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
};
