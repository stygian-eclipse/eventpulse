import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, DateObject } from 'react-native-calendars';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEvents } from '../context/EventsContext';
import { RootStackParamList } from '../navigation/types';
import EventCard from '../components/EventCard';
import EmptyState from '../components/EmptyState';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { events, loading, shareEvent, refresh } = useEvents();
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const selectedDateObj = useMemo(() => new Date(`${selectedDate}T00:00:00`), [selectedDate]);

  const eventsByDay = useMemo(() => {
    return events.filter((event) => format(new Date(event.startDate), 'yyyy-MM-dd') === selectedDate);
  }, [events, selectedDate]);

  const marked = useMemo(() => {
    const base: Record<string, { marked?: boolean; dots: { color: string }[]; selected?: boolean; selectedColor?: string; selectedTextColor?: string }> =
      {
        [selectedDate]: {
          selected: true,
          selectedColor: '#2563EB',
          selectedTextColor: '#fff',
          dots: [],
        },
      };

    return events.reduce((acc, event) => {
      const key = format(new Date(event.startDate), 'yyyy-MM-dd');
      const dots = acc[key]?.dots ? [...acc[key].dots] : [];
      if (!dots.some((dot) => dot.color === event.color)) {
        dots.push({ color: event.color });
      }
      acc[key] = {
        ...(acc[key] ?? {}),
        marked: true,
        dots,
        selected: key === selectedDate,
        selectedColor: key === selectedDate ? '#2563EB' : acc[key]?.selectedColor,
        selectedTextColor: key === selectedDate ? '#fff' : acc[key]?.selectedTextColor,
      };
      return acc;
    }, base);
  }, [events, selectedDate]);

  const onDayPress = (day: DateObject) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={styles.screen}>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Your schedule</Text>
            <Text style={styles.heading}>{format(selectedDateObj, 'EEEE, MMM d')}</Text>
          </View>
          <Text style={styles.add} onPress={() => navigation.navigate('EventEditor', { date: selectedDate })}>
            + New
          </Text>
        </View>
        <Calendar
          onDayPress={onDayPress}
          markedDates={marked}
          markingType=\"multi-dot\"
          current={selectedDate}
          enableSwipeMonths
          theme={calendarTheme}
        />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Events</Text>
          {eventsByDay.length === 0 ? (
            <EmptyState title="Nothing planned" subtitle="Tap New to add your first event." />
          ) : (
            eventsByDay.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onShare={shareEvent}
                onPress={(evt) => navigation.navigate('EventDetail', { eventId: evt.id })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const calendarTheme = {
  calendarBackground: '#fff',
  textSectionTitleColor: '#6b7280',
  todayTextColor: '#2563EB',
  dayTextColor: '#111827',
  monthTextColor: '#111827',
  selectedDayBackgroundColor: '#2563EB',
  selectedDayTextColor: '#fff',
} as const;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    color: '#6b7280',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  add: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});

export default HomeScreen;
