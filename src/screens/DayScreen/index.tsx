import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
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

  const createNewEvent = () => {
    navigation.navigate('NewEvent', {
      initialDate: format(selectedDate, 'yyyy-MM-dd'),
    });
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View>
        <DayCarousel
          events={events}
          days={days}
          onLoadMorePast={loadMorePast}
          onLoadMoreFuture={loadMoreFuture}
        />
      </View>

      <EventList selectedDate={selectedDate} />

      <TouchableOpacity style={styles.fab} onPress={createNewEvent}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  todayBtn: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
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
