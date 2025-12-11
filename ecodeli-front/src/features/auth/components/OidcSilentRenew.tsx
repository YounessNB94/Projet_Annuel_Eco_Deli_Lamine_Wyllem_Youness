import { useEffect } from 'react';

import { userManager } from '../services/oidcClient';

export const OidcSilentRenew = () => {
  useEffect(() => {
    void userManager.signinSilentCallback();
  }, []);

  return null;
};
