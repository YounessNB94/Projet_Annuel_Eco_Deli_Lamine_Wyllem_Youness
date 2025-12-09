import { Box, Typography } from '@mui/material';

interface AdminPlaceholderPageProps {
  label: string;
}

export const AdminPlaceholderPage = ({ label }: AdminPlaceholderPageProps) => (
  <Box sx={{ p: { xs: 2, md: 3 } }}>
    <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
      {label}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Cette section sera disponible prochainement dans le backoffice.
    </Typography>
  </Box>
);
