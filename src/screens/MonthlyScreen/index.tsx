import React, { useState, useMemo, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { format, startOfToday } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import { useStore } from '@/store';
import { DashboardHeader } from '@/components/DashboardHeader';
import { MonthCarousel } from '@/components/MonthCarousel';
import { EventList } from '@/components/EventList';
import {
  generateMonthsAround,
  addMonthsToList,
  addPastMonthsToList,
  findMonthIndex,
  MonthItem,
} from '@/utils/calendarUtils';

export function MonthlyScreen() {
  const navigation = useNavigation<any>();
  // const insets = useSafeAreaInsets();
  const { selectedDate, setSelectedDate, goToToday, fetchAllEvents } =
    useStore();

  const today = startOfToday();
  const [months, setMonths] = useState<MonthItem[]>(() =>
    generateMonthsAround(today),
  );

  const initialIndex = useMemo(() => findMonthIndex(months, today), [months]);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    const idx = findMonthIndex(months, today);
    if (idx >= 0) {
      // Optional: scroll to today if you want auto-follow
      // flatListRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0 });
    }
  }, [today, months]);

  const loadMorePast = () => {
    setMonths(prev => addPastMonthsToList(prev, 6));
  };

  const loadMoreFuture = () => {
    setMonths(prev => addMonthsToList(prev, 6));
  };

  const createNewEvent = () => {
    navigation.navigate('NewEvent', {
      initialDate: format(selectedDate, 'yyyy-MM-dd'),
    });
  };

  return (
    <View style={[styles.container]}>
      <MonthCarousel
        months={months}
        initialIndex={initialIndex}
        onLoadMorePast={loadMorePast}
        onLoadMoreFuture={loadMoreFuture}
      />

      <EventList selectedDate={selectedDate} />

      <TouchableOpacity style={styles.fab} onPress={createNewEvent}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f8f9fa',
    backgroundColor: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabText: {
    color: 'white',
    fontSize: 36,
    fontWeight: '300',
  },
});
