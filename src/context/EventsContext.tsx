import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Share, Alert } from 'react-native';
import { v4 as uuid } from 'uuid';
import { CalendarEvent } from '../types/Event';
import { cancelEventNotifications, scheduleEventNotifications } from '../services/notifications';
import { loadEvents, persistEvents } from '../services/storage';

interface EventsContextValue {
  events: CalendarEvent[];
  loading: boolean;
  createEvent: (event: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  updateEvent: (id: string, changes: Partial<CalendarEvent>) => Promise<CalendarEvent | undefined>;
  deleteEvent: (id: string) => Promise<void>;
  shareEvent: (event: CalendarEvent) => Promise<void>;
  refresh: () => Promise<void>;
}

const EventsContext = createContext<EventsContextValue | undefined>(undefined);

export const EventsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const stored = await loadEvents();
    setEvents(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const persist = useCallback(
    async (next: CalendarEvent[]) => {
      setEvents(next);
      await persistEvents(next);
    },
    []
  );

  const createEvent = useCallback(
    async (event: Partial<CalendarEvent>) => {
      const now = new Date().toISOString();
      const base: CalendarEvent = {
        id: uuid(),
        title: event.title ?? 'Untitled event',
        description: event.description ?? '',
        location: event.location ?? '',
        startDate: event.startDate ?? now,
        endDate: event.endDate ?? now,
        isAllDay: event.isAllDay ?? false,
        reminders: event.reminders ?? ['15m'],
        participants: event.participants ?? [],
        sharedWith: event.sharedWith ?? [],
        owner: event.owner ?? 'you@company.com',
        notificationIds: [],
        createdAt: now,
        updatedAt: now,
        color: event.color ?? pickColor(),
      };

      const notificationIds = await scheduleEventNotifications(base);
      const nextEvent = { ...base, notificationIds };
      const next = sortEvents([...events, nextEvent]);
      await persist(next);
      return nextEvent;
    },
    [events, persist]
  );

  const updateEvent = useCallback(
    async (id: string, changes: Partial<CalendarEvent>) => {
      const existing = events.find((evt) => evt.id === id);
      if (!existing) return undefined;

      await cancelEventNotifications(existing.notificationIds);
      const updated: CalendarEvent = {
        ...existing,
        ...changes,
        updatedAt: new Date().toISOString(),
      };

      const notificationIds = await scheduleEventNotifications(updated);
      updated.notificationIds = notificationIds;

      const next = sortEvents(events.map((evt) => (evt.id === id ? updated : evt)));
      await persist(next);
      return updated;
    },
    [events, persist]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      const target = events.find((evt) => evt.id === id);
      if (!target) return;
      await cancelEventNotifications(target.notificationIds);
      const next = events.filter((evt) => evt.id !== id);
      await persist(next);
    },
    [events, persist]
  );

  const shareEvent = useCallback(async (event: CalendarEvent) => {
    const date = new Date(event.startDate);
    const message = `${event.title}\n${date.toLocaleString()}\n${event.location ?? 'No location'}\n\n${event.description ?? ''}`;
    try {
      await Share.share({
        message,
        title: `Join ${event.title}`,
      });
    } catch (error) {
      Alert.alert('Unable to share event', (error as Error).message);
    }
  }, []);

  const value = useMemo(
    () => ({ events, loading, createEvent, updateEvent, deleteEvent, shareEvent, refresh }),
    [events, loading, createEvent, updateEvent, deleteEvent, shareEvent, refresh]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
};

export const useEvents = () => {
  const ctx = useContext(EventsContext);
  if (!ctx) {
    throw new Error('useEvents must be used inside EventsProvider');
  }
  return ctx;
};

const palette = ['#6C63FF', '#FF6584', '#2A9D8F', '#F4A261', '#E76F51'];
let colorCursor = 0;
function pickColor() {
  const color = palette[colorCursor % palette.length];
  colorCursor += 1;
  return color;
}

function sortEvents(list: CalendarEvent[]) {
  return [...list].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime() || a.title.localeCompare(b.title)
  );
}
