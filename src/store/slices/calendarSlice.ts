import { StateCreator } from 'zustand';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { startOfDay, isToday } from 'date-fns';

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO "2026-02-15T10:00:00Z"
  end?: string;
  allDay?: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type CalendarView = 'month' | 'day';

export interface CalendarSlice {
  currentDate: Date;
  view: CalendarView;
  selectedDate: Date;
  events: CalendarEvent[];
  isLoadingEvents: boolean;
  eventsError: string | null;

  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  setSelectedDate: (date: Date) => void;
  goToToday: () => void;
  fetchAllEvents: () => Promise<void>;
  createEvent: (
    data: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<boolean>;
  updateEvent: (
    id: string,
    updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  initializeCalendar: () => Promise<void>;
}

const getEventsRef = () => {
  const uid = auth().currentUser?.uid;
  if (!uid) throw new Error('No authenticated user');
  return firestore().collection('users').doc(uid).collection('events');
};

export const createCalendarSlice: StateCreator<CalendarSlice> = (set, get) => ({
  currentDate: new Date(),
  view: 'month',
  selectedDate: new Date(),
  events: [],
  isLoadingEvents: false,
  eventsError: null,

  setCurrentDate: date => set({ currentDate: date }),
  setView: view => set({ view }),
  setSelectedDate: date => set({ selectedDate: date }),

  goToToday: () => {
    const today = new Date();
    set({ currentDate: today, selectedDate: today });
  },

  fetchAllEvents: async () => {
    set({ isLoadingEvents: true, eventsError: null });
    try {
      const snap = await getEventsRef().orderBy('start').get();

      const loaded = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as CalendarEvent[];

      set({ events: loaded, isLoadingEvents: false });
    } catch (err: any) {
      console.error('fetchAllEvents failed:', err);
      set({
        eventsError: err.message || 'Failed to load events',
        isLoadingEvents: false,
      });
    }
  },

  createEvent: async data => {
    try {
      const now = new Date().toISOString();
      const ref = await getEventsRef().add({
        ...data,
        createdAt: now,
        updatedAt: now,
      });

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
        .update({ ...updates, updatedAt: now });

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

  initializeCalendar: async () => {
    await get().fetchAllEvents();
  },
});
