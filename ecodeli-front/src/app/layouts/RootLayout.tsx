import type { PropsWithChildren } from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

export const RootLayout = ({ children }: PropsWithChildren) => (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div">
          EcoDeli
        </Typography>
      </Toolbar>
    </AppBar>
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 0,
      }}
    >
      {children}
    </Container>
  </Box>
);
