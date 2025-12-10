import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import type { AnnouncementFormValues } from '../types/announcementForm';
import { ClientAnnouncementForm, type AnnouncementFormSubmitAction } from '../components/ClientAnnouncementForm';

export const ClientCreateAnnouncementPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (formValues: AnnouncementFormValues, action: AnnouncementFormSubmitAction) => {
    const isDraft = action === 'draft';

    // TODO: appel API POST /announcements
    console.log('Submitting announcement', { ...formValues, isDraft });

    navigate('/client/annonces');
  };

  const handleBack = () => navigate('/client/annonces');

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ bgcolor: 'background.paper' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Creer une annonce 
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Remplissez les informations de votre livraison
          </Typography>
        </Box>
      </Box>

      <ClientAnnouncementForm mode="create" onSubmit={handleSubmit} />
    </Box>
  );
};
