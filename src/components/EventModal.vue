<template>
  <Teleport to="body">
    <div class="overlay" @click.self="emitClose">
      <div class="modal">

        <div class="modal-top">
          <span class="modal-title">{{ mode === "create" ? "New event" : "Edit event" }}</span>
          <button class="modal-close" @click="emitClose">✕</button>
        </div>

        <div class="modal-body">
          <label class="field">
            <span class="field-label">Event name <em>(max 30)</em></span>
            <input v-model="title" maxlength="30" placeholder="Enter event name…" />
            <small v-if="title.trim().length === 0" class="hint">Required</small>
          </label>

          <div class="row">
            <label class="field">
              <span class="field-label">Date</span>
              <input type="date" v-model="date" />
            </label>
            <label class="field">
              <span class="field-label">Time</span>
              <input type="time" v-model="time" />
            </label>
          </div>

          <div class="color-row">
            <div>
              <span class="field-label">Color</span>
              <div class="color-hint">Choose event color</div>
            </div>
            <input class="color-picker" type="color" v-model="color" />
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-ghost" @click="emitClose">Cancel</button>
          <div class="actions-right">
            <button v-if="mode === 'edit'" class="btn-danger" @click="emitDelete">Delete</button>
            <button class="btn-primary" :disabled="!canSave" @click="emitSave">Save</button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { CalendarEvent } from "@/types/calendar";

export default defineComponent({
  name: "EventModal",
  props: {
    mode:    { type: String, required: true },
    initial: { type: Object as () => CalendarEvent, required: true },
  },
  emits: ["close", "save", "delete"],

  data() {
    const d   = new Date(this.initial.start);
    const pad = (n: number) => String(n).padStart(2, "0");
    return {
      title: this.initial.title ?? "",
      date:  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      time:  `${pad(d.getHours())}:${pad(d.getMinutes())}`,
      color: this.initial.color ?? "#3b82f6",
    };
  },

  computed: {
    canSave(): boolean {
      return this.title.trim().length > 0 && !!this.date && !!this.time;
    },
  },

  methods: {
    emitClose()  { this.$emit("close"); },
    emitDelete() { this.$emit("delete", this.initial.id); },
    emitSave() {
      const start = new Date(`${this.date}T${this.time}:00`);
      const payload: CalendarEvent = {
        id:    this.initial.id,
        title: this.title.trim().slice(0, 30),
        start: start.toISOString(),
        color: this.color,
      };
      this.$emit("save", payload);
    },
  },
});
</script>

<style scoped>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 9000;
    background: rgba(15, 23, 42, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
  }
  .modal {
    background: #fff;
    border-radius: 14px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .modal-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px 14px;
    border-bottom: 1px solid #f0f2f7;
  }
  .modal-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e2433;
  }
  .modal-close {
    border: 0;
    background: #f3f4f8;
    color: #6b7280;
    border-radius: 8px;
    width: 30px;
    height: 30px;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-close:hover {
    background: #e5e7eb;
    color: #374151;
  }
  .modal-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }
  .field-label {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.02em;
  }
  .field-label em {
    font-style: normal;
    font-weight: 400;
    color: #9ca3af;
  }
  .field input,
  .row input {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    outline: none;
    font-size: 13px;
    color: #1e2433;
    background: #fafafa;
    transition: border-color 0.15s;
  }
  .field input:focus,
  .row input:focus {
    border-color: #2563eb;
    background: #fff;
  }
  .hint {
    font-size: 11px;
    color: #ef4444;
  }
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .row label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }
  .row .field-label {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
  }
  .color-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fafafa;
  }
  .color-hint {
    font-size: 11px;
    color: #9ca3af;
    margin-top: 2px;
  }
  .color-picker {
    width: 36px;
    height: 36px;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;
  }
  .modal-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px 18px;
    border-top: 1px solid #f0f2f7;
    gap: 10px;
  }
  .actions-right {
    display: flex;
    gap: 8px;
  }
  .btn-ghost {
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #374151;
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
  }
  .btn-ghost:hover {
    background: #f9fafb;
  }
  .btn-danger {
    border: 0;
    background: #fee2e2;
    color: #dc2626;
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
  }
  .btn-danger:hover {
    background: #fecaca;
  }
  .btn-primary {
    border: 0;
    background: #2563eb;
    color: #fff;
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
  .btn-primary:hover:not(:disabled) {
    background: #1d4ed8;
  }
  .btn-primary:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  @media (max-width: 480px) {
    .modal {
      border-radius: 12px;
    }
    .row   {
      grid-template-columns: 1fr;
    }
  }
</style>