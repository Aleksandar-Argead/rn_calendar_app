import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  format,
  startOfMonth,
  isSameMonth,
  addMonths,
  subMonths,
  startOfToday,
} from 'date-fns';
import { useStore } from '@/store';
import { MonthView } from '@/components/calendar/MonthView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MONTH_WIDTH = SCREEN_WIDTH;

type MonthItem = {
  key: string; // "2026-02"
  monthDate: Date;
};

function generateMonthsAround(anchor: Date, range = 12): MonthItem[] {
  return Array.from({ length: range * 2 + 1 }, (_, i) => {
    const month = startOfMonth(addMonths(anchor, i - range));
    return {
      key: format(month, 'yyyy-MM'),
      monthDate: month,
    };
  });
}

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { selectedDate, setCurrentDate, setSelectedDate, goToToday, events } =
    useStore();

  const currentDate = startOfToday();

  const [months, setMonths] = useState(() => generateMonthsAround(currentDate));

  const flatListRef = useRef<FlatList>(null);

  const initialIndex = useMemo(
    () => months.findIndex(m => isSameMonth(m.monthDate, currentDate)),
    [months, currentDate],
  );

  useEffect(() => {
    const idx = months.findIndex(m => isSameMonth(m.monthDate, currentDate));
    if (idx >= 0) {
      flatListRef.current?.scrollToIndex({
        index: idx,
        animated: true,
        viewPosition: 0,
      });
    }
  }, [currentDate]);

  const loadMorePast = () => {
    setMonths(prev => {
      const oldest = prev[0].monthDate;
      const toAdd = Array.from({ length: 6 }, (_, i) => {
        const m = startOfMonth(subMonths(oldest, i + 1));
        return { key: format(m, 'yyyy-MM'), monthDate: m };
      });
      return [...toAdd.reverse(), ...prev];
    });
  };

  const loadMoreFuture = () => {
    setMonths(prev => {
      const newest = prev[prev.length - 1].monthDate;
      const toAdd = Array.from({ length: 6 }, (_, i) => {
        const m = startOfMonth(addMonths(newest, i + 1));
        return { key: format(m, 'yyyy-MM'), monthDate: m };
      });
      return [...prev, ...toAdd];
    });
  };

  const createNewEvent = () => {
    console.log('here');
  };

  const renderMonth = ({ item }: { item: MonthItem }) => (
    <View style={{ width: MONTH_WIDTH }}>
      <Text style={styles.monthTitle}>
        {format(item.monthDate, 'MMMM yyyy')}
      </Text>
      <MonthView
        currentMonth={item.monthDate}
        selectedDate={selectedDate}
        events={events}
        onDayPress={setSelectedDate}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToToday}>
          <Text style={styles.todayBtn}>Today</Text>
        </TouchableOpacity>
        <Text style={styles.selected}>
          {format(selectedDate, 'EEEE, MMM d, yyyy')}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={months}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: MONTH_WIDTH,
          offset: MONTH_WIDTH * index,
          index,
        })}
        renderItem={renderMonth}
        keyExtractor={item => item.key}
        onEndReached={loadMoreFuture}
        onEndReachedThreshold={0.5}
        onStartReached={loadMorePast}
        onStartReachedThreshold={0.5}
        windowSize={7}
        style={styles.monthlyFlatlist}
      />

      <View style={styles.eventsSection}>
        <Text style={styles.sectionTitle}>
          Events on {format(selectedDate, 'MMMM d, yyyy')}
        </Text>
        {/* TODO: actual event list */}
        <View
          style={{ height: 180, backgroundColor: '#f0f0f0', borderRadius: 12 }}
        />
      </View>

      <TouchableOpacity style={styles.fab} onPress={createNewEvent}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
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
  todayBtn: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  selected: { fontSize: 16, fontWeight: '500', color: '#333' },
  monthTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  monthlyFlatlist: { maxHeight: 360 },
  eventsSection: { padding: 16, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
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
  fabText: { color: 'white', fontSize: 36, fontWeight: '300' },
});
