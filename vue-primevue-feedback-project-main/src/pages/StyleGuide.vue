<template>
  <div class="surface-card p-3 border-round shadow-1">
    <h2 class="mt-0">Style Guide</h2>
    <div class="flex gap-2 mb-3"><Button label="Primary"/><Button label="Secondary" severity="secondary"/><Button label="Danger" severity="danger"/><Button icon="pi pi-check" rounded aria-label="Confirm"/><Button label="Text" text/></div>
    <div class="grid">
      <div class="col-12 md:col-4"><label class="block mb-2">InputText</label><InputText placeholder="Placeholder"/></div>
      <div class="col-12 md:col-4"><label class="block mb-2">Dropdown</label><Dropdown :options="['One','Two','Three']" placeholder="Choose…"/></div>
      <div class="col-12 md:col-4"><label class="block mb-2">Chips</label><Chips/></div>
    </div>
  </div>
</template>
<script setup>
import Button from 'primevue/button'; import InputText from 'primevue/inputtext'; import Dropdown from 'primevue/dropdown'; import Chips from 'primevue/chips'
</script>
