<template>
  <div class="card">
    <Toolbar class="mb-3">
      <template #start>
        <div class="flex align-items-center gap-2">
          <Button label="New" icon="pi pi-plus" @click="openNew" />
          <Button label="Refresh" severity="secondary" icon="pi pi-refresh" @click="store.refresh" />
        </div>
      </template>
      <template #end>
        <span class="p-input-icon-left mr-2"><i class="pi pi-search" /><InputText v-model="search" placeholder="Search..." /></span>
        <Dropdown v-model="filters.status" :options="statuses" placeholder="Status" class="mr-2" />
        <Dropdown v-model="filters.category" :options="categories" placeholder="Category" class="mr-2" />
        <ToggleButton v-model="grid" onLabel="Grid" offLabel="Table" :onIcon="'pi pi-th-large'" :offIcon="'pi pi-list'"/>
      </template>
    </Toolbar>

    <div v-if="grid" class="grid">
      <div v-for="i in filtered" :key="i.id" class="col-12 md:col-6 lg:col-4">
        <div class="surface-card p-3 border-round shadow-1">
          <div class="flex justify-content-between align-items-center mb-2">
            <h3 class="mt-0 mb-0 text-xl">{{ i.title }}</h3>
            <Button icon="pi pi-angle-up" class="p-button-sm" @click="vote(i)" :disabled="votingId===i.id">{{ i.votes || 0 }}</Button>
          </div>
          <p class="text-600 mb-2">{{ i.description }}</p>
          <div class="flex gap-2 mb-2"><Tag :value="i.category" severity="info" /><Tag :value="i.status" :severity="statusSeverity(i.status)" /></div>
          <div class="text-600 text-sm">Tags: {{ (i.tags||[]).join(', ') || '—' }}</div>
          <div class="flex justify-content-end gap-1 mt-3"><Button icon="pi pi-pencil" severity="secondary" rounded @click="editRow(i)" /><Button icon="pi pi-trash" severity="danger" rounded @click="removeRow(i)" /></div>
        </div>
      </div>
    </div>

    <DataTable v-else :value="filtered" :loading="store.loading" dataKey="id" paginator :rows="10" :rowsPerPageOptions="[5,10,20]" class="p-datatable-sm">
      <template #empty><div class="p-3 text-600">No ideas found.</div></template>
      <template #loading><div class="p-3">Loading ideas…</div></template>
      <Column field="title" header="Title" sortable />
      <Column field="category" header="Category" sortable />
      <Column field="status" header="Status" sortable><template #body="{data}"><Tag :value="data.status" :severity="statusSeverity(data.status)" /></template></Column>
      <Column field="votes" header="Votes" sortable><template #body="{data}"><Button icon="pi pi-angle-up" class="p-button-sm" @click="vote(data)" :disabled="votingId===data.id">{{ data.votes || 0 }}</Button></template></Column>
      <Column header="Actions" style="width:10rem"><template #body="{data}"><div class="flex gap-1"><Button icon="pi pi-pencil" severity="secondary" rounded @click="editRow(data)" /><Button icon="pi pi-trash" severity="danger" rounded @click="removeRow(data)" /></div></template></Column>
    </DataTable>

    <IdeaForm v-model="showForm" :value="editing" @submit="saveRow" />
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useIdeasStore } from '../stores/ideas'
import DataTable from 'primevue/datatable'; import Column from 'primevue/column'; import Button from 'primevue/button'; import InputText from 'primevue/inputtext'; import Tag from 'primevue/tag'; import Toolbar from 'primevue/toolbar'; import Dropdown from 'primevue/dropdown'; import ToggleButton from 'primevue/togglebutton'; import IdeaForm from './IdeaForm.vue'
const store = useIdeasStore()
const categories=['Platform','UI','Performance','Integrations','Security']; const statuses=['New','Planned','In Progress','Done']
const search = ref(''); const filters = ref({ status:null, category:null }); const grid = ref(false); const votingId = ref(null)
const filtered = computed(()=>{ let list = store.items; const t=search.value.trim().toLowerCase(); if(t){ list=list.filter(i=>[i.title,i.description,...(i.tags||[])].some(v=>String(v).toLowerCase().includes(t))) } if(filters.value.status) list=list.filter(i=>i.status===filters.value.status); if(filters.value.category) list=list.filter(i=>i.category===filters.value.category); return list })
function statusSeverity(s){ return s==='Done'?'success': s==='In Progress'?'warning': s==='Planned'?'info':'secondary' }
const showForm=ref(false), editing=ref(null)
function openNew(){ editing.value={ title:'', description:'', category:'', status:'New', tags:[] }; showForm.value=true }
function editRow(row){ editing.value={...row}; showForm.value=true }
async function saveRow(form){ if(editing.value?.id) await store.patch(editing.value.id, form); else await store.add(form) }
async function removeRow(row){ if(confirm('Delete this idea?')) await store.remove(row.id) }
async function vote(row){ votingId.value=row.id; await store.upvoteIdea(row.id); votingId.value=null }
onMounted(()=>{ store.refresh() })
</script>
<style scoped>.card{background:var(--surface-card);border-radius:var(--border-radius);box-shadow:0 1px 2px rgba(0,0,0,.06);padding:1rem;}</style>
