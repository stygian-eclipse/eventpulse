import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ReminderPreset } from '../types/Event';

interface Props {
  selected: ReminderPreset[];
  onToggle: (reminder: ReminderPreset) => void;
}

const OPTIONS: ReminderPreset[] = ['at_time', '5m', '15m', '1h', '1d'];

const ReminderSelector: React.FC<Props> = ({ selected, onToggle }) => (
  <View style={styles.container}>
    {OPTIONS.map((option) => {
      const active = selected.includes(option);
      return (
        <Pressable key={option} onPress={() => onToggle(option)} style={[styles.pill, active && styles.active]}>
          <Text style={[styles.label, active && styles.activeLabel]}>{label(option)}</Text>
        </Pressable>
      );
    })}
  </View>
);

function label(option: ReminderPreset) {
  switch (option) {
    case 'at_time':
      return 'At time';
    case '5m':
      return '5 min';
    case '15m':
      return '15 min';
    case '1h':
      return '1 hr';
    case '1d':
      return '1 day';
    default:
      return option;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    margin: 4,
  },
  active: {
    backgroundColor: '#2563EB',
  },
  label: {
    color: '#374151',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#fff',
  },
});

export default ReminderSelector;
