import { useCallback, useMemo, useState } from 'react';
import type {
  NotificationFeedItem,
  NotificationVisibility,
} from '../types/notifications';

interface UseNotificationFeedOptions<TFilter extends string> {
  initialItems: NotificationFeedItem[];
  initialFilter: TFilter;
  initialVisibility?: NotificationVisibility;
  filterPredicate?: (item: NotificationFeedItem, activeFilter: TFilter) => boolean;
  searchKeys?: Array<'title' | 'message'>;
}

interface UseNotificationFeedResult<TFilter extends string> {
  items: NotificationFeedItem[];
  filteredItems: NotificationFeedItem[];
  filter: TFilter;
  setFilter: (value: TFilter) => void;
  visibility: NotificationVisibility;
  setVisibility: (value: NotificationVisibility) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  markAsRead: (id: string) => void;
  dismiss: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
  totalCount: number;
}

const defaultFilterPredicate = <TFilter extends string>(item: NotificationFeedItem, activeFilter: TFilter) => {
  if (activeFilter === 'all') {
    return true;
  }
  if (activeFilter === 'critical') {
    return item.severity === 'error';
  }
  return item.source === activeFilter || item.category === activeFilter;
};

export const useNotificationFeed = <TFilter extends string>({
  initialItems,
  initialFilter,
  initialVisibility = 'all',
  filterPredicate = defaultFilterPredicate,
  searchKeys = ['title', 'message'],
}: UseNotificationFeedOptions<TFilter>): UseNotificationFeedResult<TFilter> => {
  const [items, setItems] = useState<NotificationFeedItem[]>(initialItems);
  const [filter, setFilterState] = useState<TFilter>(initialFilter);
  const [visibility, setVisibilityState] = useState<NotificationVisibility>(initialVisibility);
  const [searchTerm, setSearchTermState] = useState('');

  const setFilter = useCallback((value: TFilter) => {
    setFilterState(value);
  }, []);

  const setVisibility = useCallback((value: NotificationVisibility) => {
    setVisibilityState(value);
  }, []);

  const setSearchTerm = useCallback((value: string) => {
    setSearchTermState(value);
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      const matchesFilter = filterPredicate(item, filter);
      const matchesVisibility = visibility === 'all' || !!item.severity;
      const matchesSearch =
        normalized.length === 0 ||
        searchKeys.some((key) => item[key]?.toLowerCase().includes(normalized));
      return matchesFilter && matchesVisibility && matchesSearch;
    });
  }, [filter, filterPredicate, items, searchKeys, searchTerm, visibility]);

  const markAsRead = useCallback((id: string) => {
    setItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, severity: undefined } : item)),
    );
  }, []);

  const dismiss = useCallback((id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  }, []);

  const markAllAsRead = useCallback(() => {
    setItems((previous) => previous.map((item) => ({ ...item, severity: undefined })));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const unreadCount = useMemo(() => items.filter((item) => !!item.severity).length, [items]);
  const totalCount = useMemo(() => items.length, [items]);

  return {
    items,
    filteredItems,
    filter,
    setFilter,
    visibility,
    setVisibility,
    searchTerm,
    setSearchTerm,
    markAsRead,
    dismiss,
    markAllAsRead,
    clearAll,
    unreadCount,
    totalCount,
  };
};
