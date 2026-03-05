import { format, isSameDay } from 'date-fns';

export function formatTimeRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (isSameDay(start, end)) {
    return `${format(start, 'MMM d · h:mm a')} - ${format(end, 'h:mm a')}`;
  }
  return `${format(start, 'MMM d h:mm a')} → ${format(end, 'MMM d h:mm a')}`;
}

export function toDateInputValue(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function groupEventsByDate<T extends { startDate: string }>(events: T[]) {
  return events.reduce<Record<string, T[]>>((acc, event) => {
    const dayKey = format(new Date(event.startDate), 'yyyy-MM-dd');
    acc[dayKey] = acc[dayKey] ? [...acc[dayKey], event] : [event];
    return acc;
  }, {});
}
