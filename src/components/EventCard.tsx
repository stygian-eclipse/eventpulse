import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarEvent } from '../types/Event';
import { formatTimeRange } from '../utils/dates';

interface Props {
  event: CalendarEvent;
  onPress?: (event: CalendarEvent) => void;
  onShare?: (event: CalendarEvent) => void;
}

const EventCard: React.FC<Props> = ({ event, onPress, onShare }) => {
  return (
    <Pressable style={[styles.container, { borderLeftColor: event.color }]} onPress={() => onPress?.(event)}>
      <View style={styles.rowBetween}>
        <Text style={styles.title}>{event.title}</Text>
        <Pressable onPress={() => onShare?.(event)} hitSlop={8}>
          <Text style={styles.share}>Share</Text>
        </Pressable>
      </View>
      <Text style={styles.time}>{formatTimeRange(event.startDate, event.endDate)}</Text>
      {!!event.location && <Text style={styles.meta}>{event.location}</Text>}
      {!!event.participants.length && <Text style={styles.meta}>{event.participants.join(', ')}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2933',
  },
  time: {
    marginTop: 6,
    color: '#4b5563',
  },
  meta: {
    color: '#6b7280',
    marginTop: 4,
  },
  share: {
    color: '#2563EB',
    fontWeight: '500',
  },
});

export default EventCard;
