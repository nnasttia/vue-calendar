<template>
  <header class="topbar">
    <button class="burger" @click="$emit('toggleSidebar')">☰</button>

    <div class="search">
      <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
      </svg>
      <input placeholder="Search transactions, invoices or help" />
    </div>

    <div class="right">
      <button class="icon-btn" title="Language">
        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd"/></svg>
      </button>
      <button class="icon-btn" title="Apps">
        <svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
      </button>
      <button class="icon-btn" title="Notifications">
        <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
      </button>

      <div class="divider"></div>

      <span class="user">John Doe</span>
      <svg class="chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
      <div class="avatar"></div>
    </div>
  </header>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    name: "TopBar",
    emits: ["toggleSidebar"],
  });
</script>

<style scoped>
  .topbar {
    height: 56px;
    background: #fff;
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: space-between;
    padding: 0 18px;
    border-bottom: 1px solid #e7eaf0;
    flex-shrink: 0;
  }
  .burger {
    display: none;
    border: 1px solid #e7eaf0;
    background: #fff;
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
  }
  .search {
    flex: 1;
    min-width: 0;
    position: relative;
    display: flex;
    align-items: center;
  }
  .search-icon {
    position: absolute;
    left: 10px;
    width: 14px;
    height: 14px;
    color: #9ca3af;
    pointer-events: none;
  }
  .search input {
    width: 100%;
    max-width: 520px;
    padding: 8px 12px 8px 32px;
    border: none;
    border-radius: 0;
    outline: none;
    font-size: 13px;
    font-weight: 400;
    color: #4b5160;
    background: transparent;
    font-family: inherit;
  }
  .search input::placeholder {
    color: #adb5c6;
  }
  .right {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #4b5160;
    font-size: 13px;
    flex-shrink: 0;
  }
  .icon-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
  }
  .icon-btn:hover {
    background: #f3f4f8;
    color: #374151;
  }
  .icon-btn svg {
    width: 16px;
    height: 16px;
  }
  .divider {
    width: 1px;
    height: 20px;
    background: #e7eaf0;
    margin: 0 6px;
  }
  .user {
    white-space: nowrap;
    font-size: 13px;
    color: #4b5160;
  }
  .chevron {
    width: 14px;
    height: 14px;
    color: #9ca3af;
    flex-shrink: 0;
  }
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #cfd6e6;
    margin-left: 4px;
    flex-shrink: 0;
  }
  @media (max-width: 768px) {
    .burger {
      display: inline-flex;
    }
    .search input {
      max-width: none;
    }
    .icon-btn {
      display: none;
    }
    .divider  {
      display: none;
    }
    .chevron  {
      display: none;
    }
  }
  @media (max-width: 520px) {
    .topbar {
      flex-wrap: wrap;
      height: auto;
      padding: 10px 12px;
    }
    .search {
      width: 100%;
    }
    .right  {
      margin-left: auto;
    }
    .search input {
      max-width: 160px;
    }
  }
</style>