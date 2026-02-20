import type { CalendarEvent } from "@/types/calendar";

const KEY = "vue_calendar_events_v1";

export function loadEvents(): CalendarEvent[] {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as CalendarEvent[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveEvents(events: CalendarEvent[]) {
    localStorage.setItem(KEY, JSON.stringify(events));
}
