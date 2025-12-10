import { useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ecoDeliLogoUrl from "../../../assets/EcoDeli-Logo.svg?url";

import { useAuth } from "../../../features/auth/context/AuthContext";
import type { UserRole } from "../../../features/auth/context/AuthContext";

const navLinks = [
  { label: "Clients", path: "/client/dashboard", icon: PeopleAltOutlinedIcon },
  { label: "Livreurs", path: "/courier/devenir-livreur", icon: LocalShippingOutlinedIcon },
  { label: "Commerçants", path: "/merchant/devenir-commercant", icon: StorefrontOutlinedIcon },
  { label: "Prestataire", path: "/provider/devenir-prestataire", icon: HandshakeOutlinedIcon },
];

const brand = {
  label: "EcoDeli",
};

const notificationRoutes: Partial<Record<UserRole, string>> = {
  CLIENT: "/client/notifications",
  MERCHANT: "/merchant/notifications",
  PROVIDER: "/provider/notifications",
};

const HeaderProfileMenu = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!user) {
    return null;
  }

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const initials =
    user.avatarInitials ?? user.fullName.slice(0, 2).toUpperCase();

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<PersonOutlineOutlinedIcon />}
        onClick={handleOpen}
        sx={{ borderRadius: 999, textTransform: "none", fontWeight: 600 }}
      >
        {user.fullName}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        <MenuItem disabled>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontWeight: 600,
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight={600}>
                {user.fullName}
              </Typography>
              {user.email && (
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              )}
            </Box>
          </Stack>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={() => {
            handleClose();
            logout();
          }}
        >
          <LogoutOutlinedIcon fontSize="small" style={{ marginRight: 8 }} />
          Se déconnecter
        </MenuItem>
      </Menu>
    </>
  );
};

export const AppHeader = () => {
  const { isAuthenticated, login, user } = useAuth();
  const navigate = useNavigate();

  const notificationPath = useMemo(() => {
    if (!user) {
      return null;
    }
    for (const role of user.roles) {
      const route = notificationRoutes[role];
      if (route) {
        return route;
      }
    }
    return null;
  }, [user]);

  const handleNotificationsClick = () => {
    if (notificationPath) {
      navigate(notificationPath);
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: "background.paper",
        color: "text.primary",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar disableGutters>
        <Container
          maxWidth="xl"
          sx={{ display: "flex", alignItems: "center", gap: 3, py: 1.5 }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <img
                src={ecoDeliLogoUrl}
                alt="EcoDeli Logo"
                style={{ height: 55, marginRight: 8 }}
              />
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={700} 
                  fontStyle="italic"
                  lineHeight={1}
                  color="primary.main"
                >
                  {brand.label}
                </Typography>
              
              </Box>
            </Stack>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1 }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={RouterLink}
                to={link.path}
                variant="outlined"
                color="primary"
                startIcon={<link.icon fontSize="small" />}
                sx={{
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 999,
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          <Button
            component={RouterLink}
            to="/admin/dashboard"
            variant="outlined"
            color="primary"
            startIcon={<AdminPanelSettingsOutlinedIcon fontSize="small" />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 999,
              display: { xs: "none", sm: "inline-flex" },
            }}
          >
            Administrateur
          </Button>

          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

          <Button
            component={RouterLink}
            to="/admin/dashboard"
            variant="outlined"
            color="primary"
            startIcon={<AdminPanelSettingsOutlinedIcon fontSize="small" />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 999,
              display: { xs: "inline-flex", sm: "none" },
              mr: { xs: 1, md: 0 },
            }}
          >
            Administrateur
          </Button>

          {isAuthenticated ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton
                color="inherit"
                aria-label="Voir les notifications"
                onClick={handleNotificationsClick}
                disabled={!notificationPath}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsNoneOutlinedIcon />
                </Badge>
              </IconButton>
              <HeaderProfileMenu />
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                component={RouterLink}
                to="/client/annonces"
                variant="text"
                color="inherit"
                sx={{ fontWeight: 600, textTransform: "none" }}
              >
                S'inscrire
              </Button>
              <Button
                variant="contained"
                color="success"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 700,
                }}
                onClick={() => login()}
              >
                Se connecter
              </Button>
            </Stack>
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
};
