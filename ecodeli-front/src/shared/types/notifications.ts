import type { ComponentType, ReactNode } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { ChipProps } from '@mui/material/Chip';

export type NotificationAccent = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';

export interface NotificationCategory {
  id: string;
  title: string;
  subtitle: string;
  accent: NotificationAccent;
  icon: ComponentType<SvgIconProps>;
  items: string[];
  actions?: ReactNode;
}

export interface NotificationCenterContent {
  overline?: string;
  title: string;
  description: string;
  roleLabel: string;
  categories: NotificationCategory[];
}

export interface NotificationStat {
  label: string;
  value: string | number;
  helper?: string;
  icon?: ReactNode;
  trend?: {
    label: string;
    color?: ChipProps['color'];
  };
}

export interface NotificationFeedItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  source?: string;
  category?: string;
  severity?: ChipProps['color'];
  icon?: ReactNode;
  actions?: ReactNode;
}

export interface NotificationActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon?: ReactNode;
}

export type NotificationFilterOption<T extends string> = {
  label: string;
  value: T;
};

export type NotificationVisibility = 'all' | 'unread';
