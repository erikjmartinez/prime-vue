<template>
  <div class="surface-0 shadow-1">
    <div class="container mx-auto px-3 py-2 flex align-items-center justify-content-between">
      <div class="flex align-items-center gap-2">
        <i class="pi pi-comments text-2xl"></i>
        <router-link to="/dashboard" class="text-xl font-bold text-color no-underline">Ideas</router-link>
      </div>
      <div class="flex align-items-center gap-2">
        <router-link to="/ideas" class="p-button p-component p-button-text"><span class="p-button-label">Ideas</span></router-link>
        <router-link to="/submit" class="p-button p-component p-button-text"><span class="p-button-label">Submit</span></router-link>
        <router-link to="/style-guide" class="p-button p-component p-button-text"><span class="p-button-label">Style Guide</span></router-link>
      </div>
    </div>
  </div>
</template>
<script setup></script>
