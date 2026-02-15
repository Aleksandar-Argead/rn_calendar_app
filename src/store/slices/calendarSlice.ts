import { StateCreator } from 'zustand';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
} from 'date-fns';

// ── Types ──────────────────────────────────────────────────────────────

export type CalendarEvent = {
  id: string; // Firestore document ID
  title: string;
  description?: string;
  start: string; // ISO string e.g. "2026-02-15T10:00:00Z"
  end?: string; // ISO string or null
  allDay?: boolean;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  // color?: string;             // optional later
};

export type CalendarView = 'month' | 'day';

export interface CalendarSlice {
  // ── State ────────────────────────────────────────────────────────────
  currentDate: Date;
  view: CalendarView;
  selectedDate: Date;

  events: CalendarEvent[];
  isLoadingEvents: boolean;
  eventsError: string | null;

  // ── Actions ──────────────────────────────────────────────────────────
  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  setSelectedDate: (date: Date) => void;

  goToNext: () => void;
  goToPrev: () => void;
  goToToday: () => void;

  fetchEvents: () => Promise<void>;
  createEvent: (
    data: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<boolean>;
  updateEvent: (
    id: string,
    updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>,
  ) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;

  // Optional helper — call after login or on mount
  initializeCalendar: () => Promise<void>;
}

// Helper to get the events subcollection reference
const getEventsRef = () => {
  const uid = auth().currentUser?.uid;
  if (!uid) throw new Error('No authenticated user');
  return firestore().collection('users').doc(uid).collection('events');
};

export const createCalendarSlice: StateCreator<CalendarSlice> = (set, get) => ({
  // ── Initial state ────────────────────────────────────────────────────
  currentDate: new Date(),
  view: 'month',
  selectedDate: new Date(),

  events: [],
  isLoadingEvents: false,
  eventsError: null,

  // ── Navigation ───────────────────────────────────────────────────────
  setCurrentDate: date => set({ currentDate: date }),
  setView: view => set({ view }),
  setSelectedDate: date => set({ selectedDate: date }),

  goToNext: () => {
    const { currentDate, view } = get();
    const newDate =
      view === 'month'
        ? addMonths(currentDate, 1)
        : new Date(currentDate.setDate(currentDate.getDate() + 1));
    set({ currentDate: newDate });
    // Auto-fetch if month changed
    if (view === 'month' && !isSameMonth(newDate, currentDate)) {
      get().fetchEvents();
    }
  },

  goToPrev: () => {
    const { currentDate, view } = get();
    const newDate =
      view === 'month'
        ? subMonths(currentDate, 1)
        : new Date(currentDate.setDate(currentDate.getDate() - 1));
    set({ currentDate: newDate });
    if (view === 'month' && !isSameMonth(newDate, currentDate)) {
      get().fetchEvents();
    }
  },

  goToToday: () => {
    const today = new Date();
    set({ currentDate: today, selectedDate: today });
    if (get().view === 'month') {
      get().fetchEvents();
    }
  },

  // ── Data fetching ────────────────────────────────────────────────────
  fetchEvents: async () => {
    const { currentDate, view } = get();
    if (view === 'day') {
      // For day view you could fetch only that day — but keeping month range for simplicity
      // You can optimize later
    }

    set({ isLoadingEvents: true, eventsError: null });

    try {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      const snap = await getEventsRef()
        .where('start', '>=', monthStart.toISOString())
        .where('start', '<=', monthEnd.toISOString())
        .orderBy('start')
        .get();

      const loadedEvents = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as CalendarEvent[];

      set({ events: loadedEvents, isLoadingEvents: false });
    } catch (err: any) {
      console.error('fetchEvents failed:', err);
      set({
        eventsError: err.message || 'Failed to load events',
        isLoadingEvents: false,
      });
    }
  },

  // ── CRUD ─────────────────────────────────────────────────────────────
  createEvent: async data => {
    try {
      const now = new Date().toISOString();
      const ref = await getEventsRef().add({
        ...data,
        createdAt: now,
        updatedAt: now,
      });

      // Optimistic UI update
      set(state => ({
        events: [
          ...state.events,
          {
            id: ref.id,
            ...data,
            createdAt: now,
            updatedAt: now,
          } as CalendarEvent,
        ],
      }));

      return true;
    } catch (err: any) {
      console.error('createEvent failed:', err);
      set({ eventsError: err.message || 'Failed to create event' });
      return false;
    }
  },

  updateEvent: async (id, updates) => {
    try {
      const now = new Date().toISOString();
      await getEventsRef()
        .doc(id)
        .update({
          ...updates,
          updatedAt: now,
        });

      // Optimistic update
      set(state => ({
        events: state.events.map(ev =>
          ev.id === id ? { ...ev, ...updates, updatedAt: now } : ev,
        ),
      }));

      return true;
    } catch (err: any) {
      console.error('updateEvent failed:', err);
      set({ eventsError: err.message || 'Failed to update event' });
      return false;
    }
  },

  deleteEvent: async id => {
    try {
      await getEventsRef().doc(id).delete();

      // Optimistic remove
      set(state => ({
        events: state.events.filter(ev => ev.id !== id),
      }));

      return true;
    } catch (err: any) {
      console.error('deleteEvent failed:', err);
      set({ eventsError: err.message || 'Failed to delete event' });
      return false;
    }
  },

  // ── Lifecycle helper (call after successful login) ───────────────────
  initializeCalendar: async () => {
    await get().fetchEvents();
  },
});
