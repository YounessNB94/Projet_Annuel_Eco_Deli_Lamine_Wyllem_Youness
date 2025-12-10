import { Link as RouterLink } from "react-router-dom";
import {
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ProviderApplyHeaderProps {
  backTo?: string;
}

export const ProviderApplyHeader = ({ backTo = "/client/dashboard" }: ProviderApplyHeaderProps) => (
  <Stack direction="row" spacing={2} alignItems="flex-start" flexWrap="wrap">
    <Tooltip title="Retour à l'espace client" placement="top-start">
      <IconButton component={RouterLink} to={backTo} sx={{ bgcolor: "background.paper" }}>
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
    <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="h3" fontWeight={800}>
        Devenir prestataire EcoDeli
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Complétez ce formulaire pour que notre équipe vérifie votre profil, vos habilitations et vos disponibilités.
      </Typography>
    </Stack>
  </Stack>
);
