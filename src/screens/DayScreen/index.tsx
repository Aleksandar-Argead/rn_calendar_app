import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { format, startOfToday } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import { useStore } from '@/store';
import { DayCarousel } from '@/components/DayCarousel';
import {
  generateDaysAround,
  addFutureDays,
  addPastDays,
} from '@/utils/calendarUtils';
import { EventList } from '@/components/EventList';

export function DayScreen() {
  const { selectedDate, setSelectedDate, fetchAllEvents, goToToday, events } =
    useStore();

  const today = startOfToday();
  const [days, setDays] = useState(() => generateDaysAround(today));

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const loadMorePast = () => {
    setDays(prev => addPastDays(prev, 10));
  };

  const loadMoreFuture = () => {
    setDays(prev => addFutureDays(prev, 10));
  };

  return (
    <View style={styles.container}>
      <View>
        <DayCarousel
          events={events}
          days={days}
          onLoadMorePast={loadMorePast}
          onLoadMoreFuture={loadMoreFuture}
        />
      </View>

      <EventList selectedDate={selectedDate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
