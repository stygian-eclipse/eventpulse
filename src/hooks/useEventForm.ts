import { useMemo, useState } from 'react';
import { CalendarEvent, ReminderPreset } from '../types/Event';

const defaultReminders: ReminderPreset[] = ['15m'];

export interface EventFormState {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  reminders: ReminderPreset[];
  participants: string[];
  color: string;
}

export function useEventForm(initial?: CalendarEvent) {
  const [state, setState] = useState<EventFormState>(() => {
    if (initial) {
      return {
        title: initial.title,
        description: initial.description ?? '',
        location: initial.location ?? '',
        startDate: new Date(initial.startDate),
        endDate: new Date(initial.endDate),
        isAllDay: initial.isAllDay,
        reminders: initial.reminders ?? defaultReminders,
        participants: initial.participants ?? [],
        color: initial.color,
      };
    }

    const start = new Date();
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return {
      title: '',
      description: '',
      location: '',
      startDate: start,
      endDate: end,
      isAllDay: false,
      reminders: defaultReminders,
      participants: [],
      color: '#6C63FF',
    };
  });

  const setField = <K extends keyof EventFormState>(key: K, value: EventFormState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const toggleReminder = (reminder: ReminderPreset) => {
    setState((prev) => {
      const exists = prev.reminders.includes(reminder);
      return {
        ...prev,
        reminders: exists ? prev.reminders.filter((r) => r !== reminder) : [...prev.reminders, reminder],
      };
    });
  };

  const addParticipant = (email: string) => {
    if (!email.trim()) return;
    setState((prev) => ({ ...prev, participants: Array.from(new Set([...prev.participants, email.trim()])) }));
  };

  const removeParticipant = (email: string) => {
    setState((prev) => ({ ...prev, participants: prev.participants.filter((item) => item !== email) }));
  };

  const payload = useMemo(() => ({
    ...state,
    startDate: state.startDate,
    endDate: state.endDate,
  }), [state]);

  return { state, setField, toggleReminder, addParticipant, removeParticipant, payload };
}
