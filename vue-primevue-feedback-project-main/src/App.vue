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

<style>
/* Global utility: Line clamp for text truncation */
.line-clamp,
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp {
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.line-clamp-2 {
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
