import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import type { Announcement, AnnouncementStatus }from '../api/clientAnnouncements';
import { useClientAnnouncements } from '../hooks/useClientAnnouncements';

const statusLabelMap: Record<AnnouncementStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publiée',
  ASSIGNED: 'Assignée',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
};

const statusColorMap: Record<
  AnnouncementStatus,
  'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
> = {
  DRAFT: 'default',
  PUBLISHED: 'info',
  ASSIGNED: 'success',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const ClientAnnouncementsPage = () => {
  const { data = [], isLoading } = useClientAnnouncements();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | AnnouncementStatus
  >('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const types = useMemo(
    () =>
      Array.from(new Set(data.map((a) => a.type))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [data]
  );

  const filteredAnnouncements = useMemo(
    () =>
      data.filter((a) => {
        const matchesSearch =
          !search ||
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.origin.toLowerCase().includes(search.toLowerCase()) ||
          a.destination.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === 'ALL' || a.status === statusFilter;

        const matchesType = typeFilter === 'ALL' || a.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      }),
    [data, search, statusFilter, typeFilter]
  );

  const handleCreateAnnouncement = () => {
  };

  const renderRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={7}>Chargement des annonces…</TableCell>
        </TableRow>
      );
    }

    if (!filteredAnnouncements.length) {
      return (
        <TableRow>
          <TableCell colSpan={7}>Aucune annonce trouvée.</TableCell>
        </TableRow>
      );
    }

    return filteredAnnouncements.map((a: Announcement) => (
      <TableRow key={a.id} hover>
        <TableCell>
          <Typography variant="body2" fontWeight={600}>
            {a.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Créée le {formatDate(a.createdAt)}
          </Typography>
        </TableCell>
        <TableCell>{a.type}</TableCell>
        <TableCell>
          <Typography variant="body2">{a.origin}</Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            → {a.destination}
          </Typography>
        </TableCell>
        <TableCell>{formatDate(a.dueDate)}</TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight={600} color="success.main">
            {a.budget.toFixed(0)}€
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            size="small"
            label={statusLabelMap[a.status]}
            color={statusColorMap[a.status]}
            variant={a.status === 'DRAFT' ? 'outlined' : 'filled'}
          />
        </TableCell>
        <TableCell align="right">
          <IconButton size="small" aria-label="Voir le détail">
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" aria-label="Modifier">
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" aria-label="Supprimer">
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Mes annonces
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez toutes vos annonces de livraison
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateAnnouncement}
        >
          + Créer une annonce
        </Button>
      </Box>

      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <TextField
          size="small"
          sx={{ minWidth: 260 }}
          placeholder="Rechercher une annonce..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          size="small"
          select
          label="Tous les statuts"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as 'ALL' | AnnouncementStatus)
          }
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="ALL">Tous les statuts</MenuItem>
          <MenuItem value="PUBLISHED">Publiée</MenuItem>
          <MenuItem value="ASSIGNED">Assignée</MenuItem>
          <MenuItem value="DRAFT">Brouillon</MenuItem>
          <MenuItem value="COMPLETED">Terminée</MenuItem>
          <MenuItem value="CANCELLED">Annulée</MenuItem>
        </TextField>

        <TextField
          size="small"
          select
          label="Tous les types"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="ALL">Tous les types</MenuItem>
          {types.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Titre</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Trajet</TableCell>
                <TableCell>Échéance</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderRows()}</TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
