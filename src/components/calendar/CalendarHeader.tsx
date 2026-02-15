import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';

type Props = {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onToggleView: () => void;
  isMonthView: boolean;
};

export function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  onToggleView,
  isMonthView,
}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <TouchableOpacity onPress={onToday} style={styles.todayBtn}>
          <Text style={styles.todayText}>Today</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{format(currentMonth, 'MMMM yyyy')}</Text>

      <View style={styles.right}>
        <TouchableOpacity onPress={onPrevMonth}>
          <Text style={styles.arrow}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNextMonth}>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onToggleView} style={styles.toggle}>
          <Text style={styles.toggleText}>{isMonthView ? 'Day' : 'Month'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  left: { flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  title: { fontSize: 20, fontWeight: '600', flex: 2, textAlign: 'center' },
  todayBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  todayText: { fontWeight: '600', color: '#007AFF' },
  arrow: { fontSize: 28, color: '#007AFF', paddingHorizontal: 8 },
  toggle: { paddingHorizontal: 12 },
  toggleText: { fontSize: 16, color: '#007AFF', fontWeight: '500' },
});
