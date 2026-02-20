<template>
  <div class="app-shell">
    <AppSidebar class="sidebar-desktop" />
    <div v-if="sidebarOpen" class="drawer-overlay" @click="sidebarOpen=false">
      <div class="drawer" @click.stop>
        <button class="drawer-close" @click="sidebarOpen=false">✕</button>
        <AppSidebar />
      </div>
    </div>
    <div class="app-main">
      <TopBar @toggleSidebar="sidebarOpen = true" />
      <div class="page">
        <h1 class="page-title">Calendar</h1>
        <CalendarView />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import AppSidebar from "@/components/AppSidebar.vue";
  import TopBar from "@/components/TopBar.vue";
  import CalendarView from "@/components/CalendarView.vue";

  export default defineComponent({
    name: "App",
    components: { AppSidebar, TopBar, CalendarView },
    data() {
      return { sidebarOpen: false };
    },
  });
</script>

<style>
  .app-shell {
    display: flex;
    height: 100vh;
    background: #f2f4f8;
    overflow: hidden;
  }
  .app-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .page {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 35px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .page-title {
    margin: 0 0 14px 0;
    font-size: 22px;
    font-weight: 400;
    color: #1e2433;
    flex-shrink: 0;
  }
  .sidebar-desktop {
    display: block;
  }
  .drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.35);
    z-index: 1000;
    display: flex;
  }
  .drawer {
    position: relative;
    width: 260px;
    height: 100%;
    background: #3c3f58;
    box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  }
  .drawer-close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1001;
    border: 0;
    background: rgba(255,255,255,0.15);
    color: #fff;
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
  }
  @media (max-width: 768px) {
    .sidebar-desktop { display: none !important; }
    .page { padding: 10px; }
  }
</style>
