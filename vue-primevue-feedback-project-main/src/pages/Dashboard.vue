<template>
  <div class="grid">
    <div class="col-12 md:col-3">
      <div class="surface-card p-3 border-round shadow-1"><div class="text-500 mb-2">Total Ideas</div><div class="text-3xl font-bold">{{ stats.total }}</div></div>
    </div>
    <div class="col-12 md:col-3" v-for="(count, key) in stats.byStatus" :key="key">
      <div class="surface-card p-3 border-round shadow-1"><div class="text-500 mb-2">{{ key }}</div><div class="text-3xl font-bold">{{ count }}</div></div>
    </div>
    <div class="col-12">
      <IdeaTable />
    </div>
  </div>
</template>
<script setup>
import IdeaTable from '../components/IdeaTable.vue'
import { useIdeasStore } from '../stores/ideas'
const store = useIdeasStore()
const stats = store.stats
</script>
