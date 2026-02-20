<template>
  <div class="calendar-card">
    <div class="calendar-head">
      <div class="left">
        <div class="label">Calendar View</div>
        <div class="nav-btns">
          <button class="btn" :class="{ 'btn-nav-active': activeNav === 'today' }" @click="goToday">Today</button>
          <button class="btn" :class="{ 'btn-nav-active': activeNav === 'prev' }" @click="goPrev">Back</button>
          <button class="btn" :class="{ 'btn-nav-active': activeNav === 'next' }" @click="goNext">Next</button>
        </div>
      </div>

      <div class="center">
        <div class="title">{{ title }}</div>
      </div>

      <div class="right">
        <div class="view-switch">
          <button class="pill" :class="{ active: currentView==='dayGridMonth' }" @click="setView('dayGridMonth')">Month</button>
          <button class="pill" :class="{ active: currentView==='timeGridWeek' }" @click="setView('timeGridWeek')">Week</button>
          <button class="pill" :class="{ active: currentView==='timeGridDay' }" @click="setView('timeGridDay')">Day</button>
          <button class="pill" :class="{ active: currentView==='listWeek' }" @click="setView('listWeek')">Agenda</button>
        </div>
        <button class="add" @click="openCreate()">+ Add</button>
      </div>
    </div>

    <FullCalendar ref="fc" class="fc-wrap" :options="options" />

    <EventModal
        v-if="modalOpen && modalInitial"
        :mode="modalMode"
        :initial="modalInitial"
        @close="closeModal"
        @save="onModalSave"
        @delete="onModalDelete"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { Calendar, CalendarOptions, EventClickArg, EventDropArg } from "@fullcalendar/core";
import type { CalendarEvent } from "@/types/calendar";
import { loadEvents, saveEvents } from "@/utils/storage";
import EventModal from "@/components/EventModal.vue";

type ViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek";
type ModalMode = "create" | "edit";

export default defineComponent({
  name: "CalendarView",
  components: { FullCalendar, EventModal },

  data() {
    const stored = loadEvents();
    return {
      title: "",
      currentView: "dayGridMonth" as ViewType,
      events: stored as CalendarEvent[],
      activeNav: "today" as "today" | "prev" | "next",
      modalOpen: false,
      modalMode: "create" as ModalMode,
      modalInitial: null as CalendarEvent | null,
      options: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        headerToolbar: false,
        height: "100%",
        expandRows: true,
        fixedWeekCount: false,
        dayMaxEvents: true,
        eventDisplay: 'block',
        selectable: true,
        editable: true,
        eventOverlap: true,
        slotEventOverlap: true,
        eventOrder: "start,title",
        events: stored.map((e: CalendarEvent) => ({
          id: e.id,
          title: e.title,
          start: e.start,
          end: e.end,
          backgroundColor: e.color,
          borderColor: e.color,
        })),
      } as CalendarOptions,
    };
  },

  // Callbacks moved here so TypeScript sees all methods/data on `this`
  created() {
    this.options.datesSet = (arg: { view: { title: string; type: string } }) => {
      this.title = arg.view.title;
      this.currentView = arg.view.type as ViewType;
    };
    this.options.dateClick = (info: { dateStr: string }) => {
      this.openCreate(info.dateStr);
    };
    this.options.eventClick = (arg: EventClickArg) => {
      const id = String(arg.event.id);
      const found = this.events.find(e => e.id === id);
      if (found) this.openEdit(found);
    };
    this.options.eventDrop = (arg: EventDropArg) => {
      this.applyMoveResize(arg.event.id, arg.event.start, arg.event.end);
    };
    this.options.eventResize = (arg: { event: { id: string | number; start: Date | null; end: Date | null } }) => {
      this.applyMoveResize(arg.event.id, arg.event.start, arg.event.end);
    };
    this.options.eventDidMount = (info: { view: { type: string }; event: { backgroundColor: string }; el: HTMLElement }) => {
      // Solid Google Calendar-like appearance for all views
      info.el.style.borderRadius = '4px';
      info.el.style.border = 'none';
      info.el.style.boxShadow = '0 1px 2px rgba(0,0,0,0.15)';
    };
  },

  methods: {
    getCalApi(): Calendar | null {
      const fc = this.$refs.fc as { getApi: () => Calendar } | null;
      return fc?.getApi() ?? null;
    },

    toFcEvent(e: CalendarEvent) {
      return {
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        backgroundColor: e.color,
        borderColor: e.color,
      };
    },

    syncToCalendar() {
      const api = this.getCalApi();
      if (!api) return;
      api.removeAllEvents();
      this.events.forEach(e => api.addEvent(this.toFcEvent(e)));
      saveEvents(this.events);
    },

    applyMoveResize(id: string | number, start: Date | null, end: Date | null) {
      const sid = String(id);
      const idx = this.events.findIndex(e => e.id === sid);
      if (idx === -1 || !start) return;
      this.events[idx] = {
        ...this.events[idx],
        start: start.toISOString(),
        end: end ? end.toISOString() : undefined,
      } as CalendarEvent;
      saveEvents(this.events);
    },

    setView(view: ViewType)  { this.getCalApi()?.changeView(view); },
    goToday() { this.activeNav = "today"; this.getCalApi()?.today(); },
    goPrev()  { this.activeNav = "prev";  this.getCalApi()?.prev(); },
    goNext()  { this.activeNav = "next";  this.getCalApi()?.next(); },

    openCreate(prefillDateStr?: string) {
      const start = prefillDateStr ? new Date(prefillDateStr) : new Date();
      this.modalMode = "create";
      this.modalInitial = {
        id: crypto.randomUUID(),
        title: "",
        start: start.toISOString(),
        color: "#3b82f6",
      };
      this.modalOpen = true;
    },

    openEdit(e: CalendarEvent) {
      this.modalMode = "edit";
      this.modalInitial = { ...e };
      this.modalOpen = true;
    },

    closeModal() {
      this.modalOpen = false;
      this.modalInitial = null;
    },

    onModalSave(payload: CalendarEvent) {
      const normalized: CalendarEvent = {
        ...payload,
        title: payload.title.trim().slice(0, 30),
      };
      const idx = this.events.findIndex(e => e.id === normalized.id);
      if (idx === -1) this.events.unshift(normalized);
      else this.events.splice(idx, 1, normalized);
      this.syncToCalendar();
      this.closeModal();
    },

    onModalDelete(id: string) {
      this.events = this.events.filter(e => e.id !== id);
      this.syncToCalendar();
      this.closeModal();
    },
  },
});
</script>

<style scoped>
  .calendar-card {
    background: #fff;
    border: 1px solid #e7eaf0;
    border-radius: 10px;
    padding: 14px;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    overflow: hidden;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .calendar-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    flex-shrink: 0;
    margin-bottom: 10px;
  }
  .left, .center, .right {
    min-width: 0;
  }
  .center {
    flex: 1;
    text-align: center;
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }
  .view-switch {
    display: inline-flex;
    border: 1px solid #e7eaf0;
    border-radius: 8px;
    overflow: hidden;
  }
  .label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
  }
  .nav-btns {
    display: flex;
  }
  .btn {
    border: 1px solid #dde1ea;
    background: #fff;
    padding: 5px 12px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 400;
    font-family: inherit;
    color: #4b5160;
    cursor: pointer;
    white-space: nowrap;
    line-height: 1.5;
  }
  .btn:hover {
    background: #f7f8fb;
    border-color: #c4c9d6;
  }
  .btn-nav-active {
    color: #2563eb;
    font-weight: 500;
    border-color: #bfcfee;
  }
  .btn-nav-active:hover {
    background: #eff4ff;
    border-color: #93aee0;
  }
  .title {
    font-weight: 500;
    font-size: 14px;
    color: #3b4252;
    white-space: nowrap;
  }
  .pill {
    border: 0;
    background: #fff;
    padding: 5px 11px;
    font-size: 12px;
    font-weight: 400;
    font-family: inherit;
    color: #6b7280;
    cursor: pointer;
    white-space: nowrap;
    line-height: 1.5;
  }
  .pill.active {
    background: #f0f2f8;
    color: #2b3a67;
    font-weight: 500;
  }
  .add {
    border: 0;
    background: #2563eb;
    color: #fff;
    padding: 5px 14px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    white-space: nowrap;
    line-height: 1.5;
  }
  .fc-wrap :deep(.fc-timegrid-col.fc-day-today) {
    background-color: rgba(209, 213, 219, 0.18) !important;
  }
  .fc-wrap :deep(*) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 400;
  }
  .fc-wrap :deep(.fc-col-header-cell-cushion) {
    font-weight: 500;
    color: #6b7280;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-decoration: none;
  }

  .fc-wrap :deep(.fc-daygrid-day-number) {
    font-weight: 400;
    color: #4b5160;
    text-decoration: none;
  }
  .fc-wrap :deep(.fc-daygrid-event) {
    border-radius: 3px !important;
    border: none !important;
    padding: 2px 8px !important;
  }
  .fc-wrap :deep(.fc-timegrid-event) {
    border-radius: 4px !important;
    border: none !important;
  }
  .fc-wrap :deep(.fc-event-title) {
    font-size: 11px !important;
    font-weight: 500 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  .fc-wrap :deep(.fc-event-time) {
    font-size: 10px !important;
    font-weight: 400 !important;
    opacity: 0.85;
  }
  .fc-wrap :deep(.fc-daygrid-event .fc-event-title),
  .fc-wrap :deep(.fc-daygrid-event .fc-event-time) {
    color: #fff !important;
  }
  .fc-wrap {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  .fc-wrap :deep(.fc) {
    height: 100%;
    font-size: 12px;
  }
  .fc-wrap :deep(.fc-scroller),
  .fc-wrap :deep(.fc-scroller-liquid),
  .fc-wrap :deep(.fc-scroller-liquid-absolute),
  .fc-wrap :deep(.fc-scroller-harness) {
    overflow-x: hidden !important;
  }
  @media (max-width: 640px) {
    .calendar-card { padding: 10px; }
    .label { display: none; }
    .calendar-head { gap: 8px; }
    .center {
      order: -1;
      width: 100%;
      text-align: left;
      flex: none;
    }
    .right {
      width: 100%;
      justify-content: space-between;
    }
  }
  @media (max-width: 420px) {
    .pill { padding: 5px 8px; font-size: 11px; }
    .btn  { padding: 5px 8px; font-size: 11px; }
    .add  { padding: 6px 10px; }
  }
  @media (max-width: 768px) {
    .fc-wrap :deep(.fc-col-header-cell-cushion) {
      font-size: 11px;
      padding: 4px 2px;
    }
    .fc-wrap :deep(.fc-daygrid-day-number) {
      font-size: 11px;
      padding: 3px 5px;
    }
    .fc-wrap :deep(.fc-daygrid-day-frame) {
      min-height: 52px;
    }
    .fc-wrap :deep(.fc-event-title),
    .fc-wrap :deep(.fc-event-time) {
      font-size: 10px;
    }
    .fc-wrap :deep(.fc-daygrid-event) {
      padding: 0 2px;
      margin-bottom: 1px;
    }
    .fc-wrap :deep(.fc-timegrid-slot) {
      height: 28px;
    }
    .fc-wrap :deep(.fc-timegrid-slot-label-cushion) {
      font-size: 10px;
    }
    .fc-wrap :deep(.fc-list-event-title) {
      font-size: 12px;
    }
  }
  @media (max-width: 480px) {
    .fc-wrap :deep(.fc-col-header-cell-cushion) {
      font-size: 10px;
      padding: 3px 1px;
    }
    .fc-wrap :deep(.fc-daygrid-day-number) {
      font-size: 10px;
      padding: 2px 3px;
    }
    .fc-wrap :deep(.fc-daygrid-day-frame) {
      min-height: 38px;
    }
    .fc-wrap :deep(.fc-event-title),
    .fc-wrap :deep(.fc-event-time) {
      font-size: 9px;
    }
    .fc-wrap :deep(.fc-timegrid-slot) {
      height: 22px;
    }
    .fc-wrap :deep(.fc-timegrid-slot-label-cushion) {
      font-size: 9px;
    }
  }
</style>