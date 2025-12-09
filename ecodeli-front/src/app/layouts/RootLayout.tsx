import type { PropsWithChildren } from 'react';
import { Container, Box } from '@mui/material';
import { AppHeader } from '../../shared/components/layout/AppHeader';

export const RootLayout = ({ children }: PropsWithChildren) => (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <AppHeader />
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
