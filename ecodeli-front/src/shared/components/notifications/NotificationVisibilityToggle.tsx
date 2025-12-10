import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { NotificationVisibility } from '../../types/notifications';

interface NotificationVisibilityToggleProps {
  value: NotificationVisibility;
  onChange: (value: NotificationVisibility) => void;
  allLabel?: string;
  unreadLabel?: string;
}

export const NotificationVisibilityToggle = ({
  value,
  onChange,
  allLabel = 'Toutes',
  unreadLabel = 'Non lues',
}: NotificationVisibilityToggleProps) => (
  <ToggleButtonGroup
    size="small"
    color="primary"
    value={value}
    onChange={(_event, nextValue) => nextValue && onChange(nextValue)}
  >
    <ToggleButton value="all">{allLabel}</ToggleButton>
    <ToggleButton value="unread">{unreadLabel}</ToggleButton>
  </ToggleButtonGroup>
);
