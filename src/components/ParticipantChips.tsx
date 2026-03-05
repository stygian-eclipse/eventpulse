import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  participants: string[];
  onRemove?: (email: string) => void;
}

const ParticipantChips: React.FC<Props> = ({ participants, onRemove }) => (
  <View style={styles.container}>
    {participants.map((email) => (
      <Pressable key={email} style={styles.chip} onPress={() => onRemove?.(email)}>
        <Text style={styles.text}>{email}</Text>
        {onRemove ? <Text style={styles.remove}>×</Text> : null}
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
    margin: 4,
  },
  text: {
    color: '#0369a1',
    marginRight: 4,
  },
  remove: {
    color: '#0f172a',
    fontWeight: '700',
  },
});

export default ParticipantChips;
