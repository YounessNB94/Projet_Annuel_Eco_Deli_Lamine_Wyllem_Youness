import RoomIcon from "@mui/icons-material/Room";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NavigationIcon from "@mui/icons-material/Navigation";
import { Box, Card, CardContent, Typography } from "@mui/material";

interface TrackingMapCardProps {
  fromLabel: string;
  toLabel: string;
  statusLabel: string;
}

export const TrackingMapCard = ({
  fromLabel,
  toLabel,
  statusLabel,
}: TrackingMapCardProps) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 3,
      border: (theme) => `1px solid ${theme.palette.divider}`,
    }}
  >
    <CardContent sx={{ p: 0 }}>
      <Box
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "transparent",
        }}
      >
        <Box
          sx={{
            aspectRatio: "16 / 9",
            width: "100%",
            background:
              "linear-gradient(135deg, rgba(102, 187, 106, 0.25), rgba(46, 125, 50, 0.2))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ textAlign: "center", color: "text.primary" }}>
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                bgcolor: "background.paper",
                boxShadow: (theme) => theme.shadows[4],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
              }}
            >
              <NavigationIcon sx={{ fontSize: 48, color: "primary.main" }} />
            </Box>
            <Typography variant="h6" sx={{ mt: 3 }}>
              Carte interactive
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Suivi GPS en temps réel
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                mt: 1.5,
                px: 2,
                py: 0.5,
                borderRadius: 99,
                bgcolor: "common.white",
                boxShadow: (theme) => theme.shadows[2],
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  minWidth: 32,
                  minHeight: 32,
                  flex: "0 0 32px",
                  borderRadius: "50%",
                  bgcolor: "background.default",
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                <LocalShippingIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                variant="caption"
                fontWeight={600}
                color="primary.main"
              >
                {statusLabel}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: 32,
              left: 32,
              bgcolor: "common.white",
              borderRadius: 2,
              boxShadow: (theme) => theme.shadows[3],
              p: 2,
              maxWidth: 220,
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  aspectRatio: "1 / 1",
                  flexShrink: 0,
                  bgcolor: "primary.main",
                  color: "common.white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RoomIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Départ
                </Typography>
                <Typography variant="body2">{fromLabel}</Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 32,
              right: 32,
              bgcolor: "common.white",
              borderRadius: 2,
              boxShadow: (theme) => theme.shadows[3],
              p: 2,
              maxWidth: 220,
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  aspectRatio: "1 / 1",
                  flexShrink: 0,
                  bgcolor: "error.main",
                  color: "common.white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RoomIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Destination
                </Typography>
                <Typography variant="body2">{toLabel}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);
