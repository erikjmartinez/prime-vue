<template>
  <div class="min-h-screen surface-ground text-color">
    <HeaderBar />
    <main class="p-3 md:p-4 lg:p-5">
      <router-view />
    </main>
  </div>
</template>
<script setup>
import HeaderBar from './components/HeaderBar.vue'
</script>
