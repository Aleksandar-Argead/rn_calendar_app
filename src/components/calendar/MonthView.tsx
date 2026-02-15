import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from 'date-fns';
import { DayCell } from './DayCell';
import { WeekdaysHeader } from './WeekdaysHeader';

type Props = {
  currentMonth: Date;
  selectedDate: Date;
  events: { start: string }[]; // simplified — date as ISO string "2026-02-15"
  onDayPress: (date: Date) => void;
};

export function MonthView({
  currentMonth,
  selectedDate,
  events,
  onDayPress,
}: Props) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Calendar usually shows full weeks → start from Monday or Sunday
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 0 = Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Group into weeks (7 days)
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Simple event map: which days have events
  const daysWithEvents = new Set(
    events.map(e => e.start.split('T')[0]), // "2026-02-15"
  );

  return (
    <View style={styles.container}>
      <WeekdaysHeader />

      {weeks.map((week, weekIdx) => (
        <View key={weekIdx} style={styles.week}>
          {week.map(day => (
            <DayCell
              key={day.toISOString()}
              date={day}
              isCurrentMonth={isSameMonth(day, currentMonth)}
              selectedDate={selectedDate}
              hasEvents={daysWithEvents.has(day.toISOString().split('T')[0])}
              onPress={onDayPress}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  week: {
    flexDirection: 'row',
  },
});
