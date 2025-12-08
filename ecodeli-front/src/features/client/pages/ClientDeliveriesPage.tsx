import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
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
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { useNavigate } from 'react-router-dom';
import type { Delivery, DeliveryStatus } from '../api/clientDeliveries';
import { useClientDeliveries } from '../hooks/useClientDeliveries';
import { DeliveryStatusChip } from '../components/DeliveryStatusChip';

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const ClientDeliveriesPage = () => {
  const navigate = useNavigate();
  const { data = [], isLoading } = useClientDeliveries();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | DeliveryStatus>(
    'ALL'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDeliveries = useMemo(
    () =>
      data.filter((d) => {
        const searchLower = search.toLowerCase();

        const matchesSearch =
          !search ||
          d.id.toLowerCase().includes(searchLower) ||
          d.origin.toLowerCase().includes(searchLower) ||
          d.destination.toLowerCase().includes(searchLower) ||
          d.courierName.toLowerCase().includes(searchLower);

        const matchesStatus =
          statusFilter === 'ALL' || d.status === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [data, search, statusFilter]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDeliveries.length / itemsPerPage)
  );

  const paginatedDeliveries = useMemo(
    () =>
      filteredDeliveries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredDeliveries, currentPage]
  );

  const hasActiveFilters = !!search || statusFilter !== 'ALL';

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  const handleViewDelivery = (id: string) => {
    navigate(`/client/livraisons/${id}`);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          Mes livraisons
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Suivez toutes vos livraisons en cours et terminées
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: (t) => `1px solid ${t.palette.divider}`,
          mb: 2,
        }}
      >
        <CardContent sx={{ pt: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              size="small"
              placeholder="Rechercher une livraison..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              size="small"
              select
              label="Statut"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as 'ALL' | DeliveryStatus);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="ALL">Tous les statuts</MenuItem>
              <MenuItem value="ACCEPTED">Acceptée</MenuItem>
              <MenuItem value="PICKED_UP">Collectée</MenuItem>
              <MenuItem value="IN_TRANSIT">En transit</MenuItem>
              <MenuItem value="DELIVERED">Livrée</MenuItem>
            </TextField>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {filteredDeliveries.length} résultat
          {filteredDeliveries.length > 1 ? 's' : ''}
        </Typography>

        {hasActiveFilters && (
          <Button
            size="small"
            variant="text"
            onClick={handleResetFilters}
          >
            Réinitialiser les filtres
          </Button>
        )}
      </Box>

      {isLoading ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Typography>Chargement des livraisons…</Typography>
        </Paper>
      ) : (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          {paginatedDeliveries.length === 0 ? (
            <CardContent
              sx={{
                py: 8,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <LocalShippingOutlinedIcon
                sx={{ fontSize: 56, mb: 2, opacity: 0.6 }}
              />
              <Typography variant="h6" gutterBottom>
                Aucune livraison trouvée
              </Typography>
              <Typography variant="body2">
                {hasActiveFilters
                  ? 'Essayez de modifier vos filtres.'
                  : "Vous n'avez aucune livraison pour le moment."}
              </Typography>
            </CardContent>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Trajet</TableCell>
                    <TableCell>Livreur</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Estimation</TableCell>
                    <TableCell>Prix</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedDeliveries.map((d: Delivery) => (
                    <TableRow key={d.id} hover>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontFamily="monospace"
                        >
                          {d.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{d.origin}</Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          → {d.destination}
                        </Typography>
                      </TableCell>
                      <TableCell>{d.courierName}</TableCell>
                      <TableCell>{formatDate(d.date)}</TableCell>
                      <TableCell>{d.estimatedTime}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="success.main"
                        >
                          {d.price.toFixed(2)} €
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <DeliveryStatusChip status={d.status} />
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            aria-label="Voir le détail"
                            onClick={() => handleViewDelivery(d.id)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      )}

      {totalPages > 1 && (
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              setCurrentPage((prev) => Math.max(1, prev - 1))
            }
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <Typography
            variant="body2"
            sx={{ alignSelf: 'center', minWidth: 80, textAlign: 'center' }}
          >
            Page {currentPage} / {totalPages}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </Box>
      )}
    </Box>
  );
};
