import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useNavigate } from "react-router-dom";
import type {
  Announcement,
  AnnouncementStatus,
} from "../api/clientAnnouncements";
import { useClientAnnouncements } from "../hooks/useClientAnnouncements";
import { AnnouncementStatusChip } from "../components/AnnouncementStatusChip";

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const ClientAnnouncementsPage = () => {
  const navigate = useNavigate();
  const { data = [], isLoading } = useClientAnnouncements();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AnnouncementStatus>(
    "ALL"
  );
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<
    string | null
  >(null);

  const itemsPerPage = 10;
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
        const searchLower = search.toLowerCase();
        const matchesSearch =
          !search ||
          a.title.toLowerCase().includes(searchLower) ||
          a.origin.toLowerCase().includes(searchLower) ||
          a.destination.toLowerCase().includes(searchLower);

        const matchesStatus =
          statusFilter === "ALL" || a.status === statusFilter;

        const matchesType = typeFilter === "ALL" || a.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      }),
    [data, search, statusFilter, typeFilter]
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAnnouncements.length / itemsPerPage)
  );

  const paginatedAnnouncements = useMemo(
    () =>
      filteredAnnouncements.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredAnnouncements, currentPage]
  );

  const hasActiveFilters =
    !!search || statusFilter !== "ALL" || typeFilter !== "ALL";

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setCurrentPage(1);
  };

  const handleCreateAnnouncement = () => {
    navigate('/client/annonces/nouvelle');
  };

  const handleViewAnnouncement = (id: string) => {
    // TODO: navigation réelle
    // navigate(`/client/annonces/${id}`);
  };

  const handleEditAnnouncement = (id: string) => {
    void id;
  };

  const askDelete = (id: string) => {
    setSelectedAnnouncementId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAnnouncementId) {
      console.log("Deleting announcement:", selectedAnnouncementId);
    }
    setDeleteDialogOpen(false);
    setSelectedAnnouncementId(null);
  };

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            Mes annonces
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez toutes vos annonces de livraison
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateAnnouncement}
          sx={{ alignSelf: { xs: "stretch", md: "auto" } }}
        >
          Créer une annonce
        </Button>
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
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              size="small"
              placeholder="Rechercher une annonce..."
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
                setStatusFilter(
                  event.target.value as "ALL" | AnnouncementStatus
                );
                setCurrentPage(1);
              }}
            >
              <MenuItem value="ALL">Tous les statuts</MenuItem>
              <MenuItem value="DRAFT">Brouillon</MenuItem>
              <MenuItem value="PUBLISHED">Publiée</MenuItem>
              <MenuItem value="ASSIGNED">Assignée</MenuItem>
              <MenuItem value="COMPLETED">Terminée</MenuItem>
              <MenuItem value="CANCELLED">Annulée</MenuItem>
            </TextField>

            <TextField
              size="small"
              select
              label="Type"
              value={typeFilter}
              onChange={(event) => {
                setTypeFilter(event.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="ALL">Tous les types</MenuItem>
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {filteredAnnouncements.length} résultat
          {filteredAnnouncements.length > 1 ? "s" : ""}
        </Typography>

        {hasActiveFilters && (
          <Button size="small" variant="text" onClick={handleResetFilters}>
            Réinitialiser les filtres
          </Button>
        )}
      </Box>

      {isLoading ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Typography>Chargement des annonces…</Typography>
        </Paper>
      ) : (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          {paginatedAnnouncements.length === 0 ? (
            <CardContent
              sx={{
                py: 8,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <Inventory2OutlinedIcon
                sx={{ fontSize: 56, mb: 2, opacity: 0.6 }}
              />
              <Typography variant="h6" gutterBottom>
                Aucune annonce trouvée
              </Typography>
              <Typography variant="body2">
                {hasActiveFilters
                  ? "Essayez de modifier vos filtres."
                  : "Créez votre première annonce pour commencer."}
              </Typography>
              {!hasActiveFilters && (
                <Button
                  sx={{ mt: 3 }}
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateAnnouncement}
                >
                  Créer une annonce
                </Button>
              )}
            </CardContent>
          ) : (
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
                <TableBody>
                  {paginatedAnnouncements.map((a: Announcement) => (
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
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="success.main"
                        >
                          {a.budget.toFixed(0)}€
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <AnnouncementStatusChip status={a.status} />
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            aria-label="Voir le détail"
                            onClick={() => handleViewAnnouncement(a.id)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>

                          {(a.status === "DRAFT" ||
                            a.status === "PUBLISHED") && (
                            <IconButton
                              size="small"
                              aria-label="Modifier"
                              onClick={() => handleEditAnnouncement(a.id)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          )}

                          {a.status === "DRAFT" && (
                            <IconButton
                              size="small"
                              aria-label="Supprimer"
                              onClick={() => askDelete(a.id)}
                            >
                              <DeleteOutlineOutlinedIcon
                                fontSize="small"
                                color="error"
                              />
                            </IconButton>
                          )}
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
            display: "flex",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <Typography
            variant="body2"
            sx={{ alignSelf: "center", minWidth: 80, textAlign: "center" }}
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est
            irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
