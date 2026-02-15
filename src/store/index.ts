// src/store/index.ts
import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from '@/store/slices/authSlice';
import {
  CalendarSlice,
  createCalendarSlice,
} from '@/store/slices/calendarSlice';

// You can import more slices later and combine them the same way
type Store = AuthSlice & CalendarSlice; // ← extend here when you add calendar/events slices

export const useStore = create<Store>()((...args) => ({
  ...createAuthSlice(...args),
  ...createCalendarSlice(...args),
  // ...createEventsSlice(...args),
}));
