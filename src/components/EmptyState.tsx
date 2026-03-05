import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  title: string;
  subtitle?: string;
}

const EmptyState: React.FC<Props> = ({ title, subtitle }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  subtitle: {
    marginTop: 8,
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});

export default EmptyState;
