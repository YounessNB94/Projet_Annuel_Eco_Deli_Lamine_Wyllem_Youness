import { Box, Chip, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import type { DeliveryTimelineItem } from '../../api/clientDeliveryDetails';

interface Props {
  items: DeliveryTimelineItem[];
}

export const DeliveryTimeline = ({ items }: Props) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    {items.map((item, index) => {
      const isLast = index === items.length - 1;
      const circleBg = item.completed
        ? item.current
          ? 'warning.main'
          : 'success.main'
        : 'grey.300';
      const circleColor = item.completed ? 'common.white' : 'grey.500';
      const lineColor = item.completed ? 'success.main' : 'grey.300';

      return (
        <Box key={item.status} sx={{ display: 'flex', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mr: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: circleBg,
                color: circleColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.completed ? (
                <CheckCircleOutlineIcon fontSize="small" />
              ) : (
                <RadioButtonUncheckedIcon fontSize="small" />
              )}
            </Box>
            {!isLast && (
              <Box
                sx={{
                  width: 2,
                  flexGrow: 1,
                  bgcolor: lineColor,
                  mt: 0.5,
                  minHeight: 40,
                }}
              />
            )}
          </Box>

          <Box sx={{ flex: 1, pb: isLast ? 0 : 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight={item.completed ? 600 : 500}
              color={item.completed ? 'text.primary' : 'text.secondary'}
            >
              {item.label}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {item.dateLabel}
            </Typography>
            {item.current && (
              <Chip
                label="En cours"
                size="small"
                color="warning"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Box>
      );
    })}
  </Box>
);
