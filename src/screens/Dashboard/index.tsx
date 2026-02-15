import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  format,
  startOfMonth,
  isSameMonth,
  addMonths,
  subMonths,
} from 'date-fns';
import { useStore } from '@/store'; // assumes your store combines slices
import { MonthView } from '@/components/calendar/MonthView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MONTH_WIDTH = SCREEN_WIDTH;

type MonthItem = {
  key: string; // "2026-02"
  monthDate: Date; // 2026-02-01
};

function generateMonthsAround(anchor: Date, range = 12): MonthItem[] {
  const months: MonthItem[] = [];
  for (let i = -range; i <= range; i++) {
    const m = startOfMonth(addMonths(anchor, i));
    months.push({
      key: format(m, 'yyyy-MM'),
      monthDate: m,
    });
  }
  return months;
}

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const {
    currentDate,
    selectedDate,
    setCurrentDate,
    setSelectedDate,
    goToToday,
    events,
    isLoadingEvents,
    fetchEvents,
  } = useStore();

  const [months, setMonths] = useState<MonthItem[]>(
    generateMonthsAround(currentDate, 12),
  );

  const flatListRef = useRef<FlatList>(null);

  // Initial scroll to current month
  const initialIndex = useMemo(
    () => months.findIndex(m => isSameMonth(m.monthDate, currentDate)),
    [months, currentDate],
  );

  // Re-center list if currentDate changes significantly (e.g. goToToday)
  useEffect(() => {
    const idx = months.findIndex(m => isSameMonth(m.monthDate, currentDate));
    if (idx !== -1) {
      flatListRef.current?.scrollToIndex({
        index: idx,
        animated: true,
        viewPosition: 0,
      });
    }
  }, [currentDate]);

  // Load more when approaching edges
  const loadMorePast = () => {
    setMonths(prev => {
      const oldest = prev[0].monthDate;
      const toAdd = [];
      for (let i = 1; i <= 6; i++) {
        const newM = startOfMonth(subMonths(oldest, i));
        toAdd.unshift({
          key: format(newM, 'yyyy-MM'),
          monthDate: newM,
        });
      }
      return [...toAdd, ...prev];
    });
  };

  const loadMoreFuture = () => {
    setMonths(prev => {
      const newest = prev[prev.length - 1].monthDate;
      const toAdd = [];
      for (let i = 1; i <= 6; i++) {
        const newM = startOfMonth(addMonths(newest, i));
        toAdd.push({
          key: format(newM, 'yyyy-MM'),
          monthDate: newM,
        });
      }
      return [...prev, ...toAdd];
    });
  };

  // Memoized: which days have events (yyyy-MM-dd)
  const daysWithEvents = useMemo(() => {
    const set = new Set<string>();
    events.forEach(ev => {
      if (ev.start) {
        set.add(ev.start.split('T')[0]);
      }
    });
    return set;
  }, [events]);

  const renderMonth = ({ item }: { item: MonthItem }) => (
    <View style={{ width: MONTH_WIDTH }}>
      <Text style={styles.monthTitle}>
        {format(item.monthDate, 'MMMM yyyy')}
      </Text>

      <MonthView
        currentMonth={item.monthDate}
        selectedDate={selectedDate}
        events={events}
        onDayPress={date => {
          setSelectedDate(date);
          // Optional: also update currentDate if you want navigation to follow selection
          // setCurrentDate(startOfMonth(date));
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToToday}>
          <Text style={styles.todayBtn}>Today</Text>
        </TouchableOpacity>

        <Text style={styles.selected}>
          {format(selectedDate, 'EEEE, MMM d, yyyy')}
        </Text>
      </View>

      {/* Loading overlay / indicator */}
      {isLoadingEvents && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={months}
        renderItem={renderMonth}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex >= 0 ? initialIndex : 0}
        getItemLayout={(_, index) => ({
          length: MONTH_WIDTH,
          offset: MONTH_WIDTH * index,
          index,
        })}
        onEndReached={loadMoreFuture}
        onEndReachedThreshold={0.4}
        onStartReached={loadMorePast}
        onStartReachedThreshold={0.4}
        windowSize={7} // keep ~3–4 months offscreen each side
      />

      {/* Selected day events list */}
      <View style={styles.eventsSection}>
        <Text style={styles.sectionTitle}>
          Events on {format(selectedDate, 'MMMM d, yyyy')}
        </Text>
        {/* Render events.filter(e => isSameDay(parseISO(e.start), selectedDate)) */}
        {/* For now placeholder */}
        <View
          style={{ height: 180, backgroundColor: '#f0f0f0', borderRadius: 12 }}
        />
      </View>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
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
    color: '#111',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  eventsSection: { padding: 16, backgroundColor: '#fff', flexShrink: 0 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#222',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 8,
  },
  fabText: { color: 'white', fontSize: 36, fontWeight: '300' },
});
