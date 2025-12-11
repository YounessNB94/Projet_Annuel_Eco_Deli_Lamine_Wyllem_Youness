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
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ecoDeliLogoUrl from "../../../assets/EcoDeli-Logo.svg?url";

import { useAuth } from "../../../features/auth/context/AuthContext";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import type { AppNavigationIconKey } from "../../api/appNavigation";

const navLinkIconFactory: Record<AppNavigationIconKey, typeof PeopleAltOutlinedIcon> = {
  client: PeopleAltOutlinedIcon,
  courier: LocalShippingOutlinedIcon,
  merchant: StorefrontOutlinedIcon,
  provider: HandshakeOutlinedIcon,
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
            void logout();
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
  const { data: navigationData } = useAppNavigation();
  const [isNavDrawerOpen, setNavDrawerOpen] = useState(false);

  const navLinks = navigationData?.navLinks ?? [];
  const brandLabel = navigationData?.brand.label ?? "EcoDeli";
  const notificationRoutes = navigationData?.notificationRoutes;
  const notificationBadgeCount = navigationData?.notificationBadgeCount ?? 0;

  const notificationPath = useMemo(() => {
    if (!user || !notificationRoutes) {
      return null;
    }
    for (const role of user.roles) {
      const route = notificationRoutes[role];
      if (route) {
        return route;
      }
    }
    return null;
  }, [notificationRoutes, user]);

  const handleNotificationsClick = () => {
    if (notificationPath) {
      navigate(notificationPath);
    }
  };

  const handleOpenNavDrawer = () => setNavDrawerOpen(true);
  const handleCloseNavDrawer = () => setNavDrawerOpen(false);

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
          sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}
        >
          <IconButton
            color="inherit"
            aria-label="Ouvrir le menu de navigation"
            onClick={handleOpenNavDrawer}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <MenuOutlinedIcon />
          </IconButton>

          <Box
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              flexGrow: { xs: 1, md: 0 },
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
            }}
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
                  {brandLabel}
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
            {navLinks.map((link) => {
              const IconComponent = navLinkIconFactory[link.icon];
              return (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  variant="outlined"
                  color="primary"
                  startIcon={<IconComponent fontSize="small" />}
                  sx={{
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 999,
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
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
              display: { xs: "none", md: "inline-flex" },
            }}
          >
            Administrateur
          </Button>

          {isAuthenticated ? (
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <IconButton
                color="inherit"
                aria-label="Voir les notifications"
                onClick={handleNotificationsClick}
                disabled={!notificationPath}
              >
                <Badge badgeContent={notificationBadgeCount} color="error">
                  <NotificationsNoneOutlinedIcon />
                </Badge>
              </IconButton>
              <HeaderProfileMenu />
            </Stack>
          ) : (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
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
                onClick={() => {
                  void login();
                }}
              >
                Se connecter
              </Button>
            </Stack>
          )}
        </Container>
      </Toolbar>

      <Drawer
        anchor="left"
        open={isNavDrawerOpen}
        onClose={handleCloseNavDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 300, p: 2, gap: 2 },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Navigation
          </Typography>
          <IconButton onClick={handleCloseNavDrawer} size="small" aria-label="Fermer le menu">
            <CloseOutlinedIcon />
          </IconButton>
        </Stack>
        <Divider />
        <List sx={{ p: 0 }}>
          {navLinks.map((link) => {
            const IconComponent = navLinkIconFactory[link.icon];
            return (
              <ListItemButton
                key={link.path}
                component={RouterLink}
                to={link.path}
                onClick={handleCloseNavDrawer}
              >
                <ListItemIcon>
                  <IconComponent fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            );
          })}
        </List>
        {notificationPath ? (
          <Button
            variant="outlined"
            startIcon={<NotificationsNoneOutlinedIcon fontSize="small" />}
            onClick={() => {
              handleCloseNavDrawer();
              navigate(notificationPath);
            }}
          >
            Notifications
          </Button>
        ) : null}
        <Button
          component={RouterLink}
          to="/admin/dashboard"
          variant="outlined"
          color="primary"
          startIcon={<AdminPanelSettingsOutlinedIcon fontSize="small" />}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 999 }}
          onClick={handleCloseNavDrawer}
        >
          Administrateur
        </Button>
        {isAuthenticated ? null : (
          <Stack spacing={1}>
            <Button
              component={RouterLink}
              to="/client/annonces"
              variant="text"
              color="inherit"
              sx={{ fontWeight: 600, textTransform: "none" }}
              onClick={handleCloseNavDrawer}
            >
              S'inscrire
            </Button>
            <Button
              variant="contained"
              color="success"
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}
              onClick={() => {
                handleCloseNavDrawer();
                void login();
              }}
            >
              Se connecter
            </Button>
          </Stack>
        )}
      </Drawer>
    </AppBar>
  );
};
