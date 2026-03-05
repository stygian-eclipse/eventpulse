import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useEvents } from '../context/EventsContext';
import { formatTimeRange } from '../utils/dates';
import ParticipantChips from '../components/ParticipantChips';

const EventDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EventDetail'>>();
  const { eventId } = route.params;
  const { events, deleteEvent, shareEvent } = useEvents();
  const event = events.find((evt) => evt.id === eventId);

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Event not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete event', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteEvent(event.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{event.title}</Text>
      <Text style={styles.time}>{formatTimeRange(event.startDate, event.endDate)}</Text>
      {event.location ? <Text style={styles.meta}>{event.location}</Text> : null}
      {event.description ? <Text style={styles.description}>{event.description}</Text> : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Participants</Text>
        {event.participants.length ? <ParticipantChips participants={event.participants} /> : <Text>No participants yet.</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reminders</Text>
        <Text>{event.reminders.join(', ')}</Text>
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.primary} onPress={() => navigation.navigate('EventEditor', { eventId: event.id })}>
          <Text style={styles.primaryLabel}>Edit</Text>
        </Pressable>
        <Pressable style={styles.secondary} onPress={() => shareEvent(event)}>
          <Text style={styles.secondaryLabel}>Share</Text>
        </Pressable>
        <Pressable style={styles.destructive} onPress={handleDelete}>
          <Text style={styles.primaryLabel}>Delete</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    gap: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
  },
  time: {
    color: '#4b5563',
  },
  meta: {
    color: '#6b7280',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  primary: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  destructive: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondary: {
    flex: 1,
    backgroundColor: '#e0e7ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryLabel: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EventDetailScreen;
