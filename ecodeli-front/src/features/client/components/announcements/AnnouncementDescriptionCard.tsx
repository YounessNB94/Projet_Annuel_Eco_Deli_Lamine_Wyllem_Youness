import { Card, CardContent, CardHeader, Typography } from '@mui/material';

interface AnnouncementDescriptionCardProps {
  description: string;
}

export const AnnouncementDescriptionCard = ({ description }: AnnouncementDescriptionCardProps) => (
  <Card
    elevation={0}
    sx={{ borderRadius: 3, border: (theme) => `1px solid ${theme.palette.divider}` }}
  >
    <CardHeader
      title="Description"
      sx={{ '& .MuiCardHeader-title': { fontSize: 18, fontWeight: 600 } }}
    />
    <CardContent>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);
