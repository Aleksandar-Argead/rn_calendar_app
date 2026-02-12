export interface Event {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string; // ISO string (e.g. "2026-02-12T10:00:00")
  endDate: string;
  allDay: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}
