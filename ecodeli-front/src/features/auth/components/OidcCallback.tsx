import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Stack, Typography } from '@mui/material';

import { userManager } from '../services/oidcClient';

export const OidcCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const processCallback = async () => {
      try {
        const user = await userManager.signinRedirectCallback();
        const state = user?.state as { returnTo?: string } | undefined;
        if (isMounted) {
          navigate(state?.returnTo ?? '/', { replace: true });
        }
      } catch {
        if (isMounted) {
          navigate('/', { replace: true });
        }
      }
    };

    void processCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ minHeight: '100vh' }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Connexion en cours...
      </Typography>
    </Stack>
  );
};
