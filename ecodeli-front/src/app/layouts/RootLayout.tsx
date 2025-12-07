import type { PropsWithChildren } from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

export const RootLayout = ({ children }: PropsWithChildren) => (
  <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div">
          EcoDeli
        </Typography>
      </Toolbar>
    </AppBar>

    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {children}
    </Container>
  </Box>
);
