<template>
  <div class="card">
    <!-- Toolbar -->
    <Toolbar class="mb-3">
      <template #start>
        <div class="flex align-items-center gap-2">
          <Button label="New" icon="pi pi-plus" @click="openNew" />
          <Button label="Refresh" severity="secondary" icon="pi pi-refresh" @click="handleRefresh" :loading="store.loading" />
          
          <!-- Export Menu -->
          <Button
            icon="pi pi-download"
            severity="secondary"
            outlined
            v-tooltip.top="'Export ideas'"
            @click="toggleExportMenu"
            aria-haspopup="true"
            aria-controls="export-menu"
          />
          <Menu ref="exportMenu" id="export-menu" :model="exportMenuItems" popup />
        </div>
      </template>
      <template #end>
        <div class="flex flex-wrap align-items-center gap-2">
          <!-- Search -->
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="search" placeholder="Search..." class="w-12rem ml-3" />
          </span>
          
          <!-- Status Filter -->
          <Dropdown 
            v-model="filters.status" 
            :options="statuses" 
            placeholder="Status" 
            showClear
            class="w-9rem"
          />
          
          <!-- Category Filter -->
          <Dropdown 
            v-model="filters.category" 
            :options="categories" 
            placeholder="Category" 
            showClear
            class="w-9rem"
          />
          
          <!-- Clear Filters -->
          <Button 
            v-if="hasActiveFilters" 
            icon="pi pi-filter-slash" 
            severity="secondary" 
            text 
            rounded
            v-tooltip.top="'Clear all filters'"
            @click="clearFilters" 
          />
          
          <!-- Column Toggle (Table view only) -->
          <Button
            v-if="!grid"
            icon="pi pi-cog"
            severity="secondary"
            text
            rounded
            v-tooltip.top="'Toggle columns'"
            @click="toggleColumnMenu"
            aria-haspopup="true"
            aria-controls="column-menu"
          />
          <Menu ref="columnMenu" id="column-menu" :model="columnMenuItems" popup />
          
          <!-- View Toggle -->
          <ToggleButton 
            v-model="grid" 
            onLabel="Grid" 
            offLabel="Table" 
            onIcon="pi pi-th-large" 
            offIcon="pi pi-list"
            @change="clearSelection"
          />
        </div>
      </template>
    </Toolbar>

    <!-- Bulk Actions Bar (shown when items selected in table view) -->
    <div v-if="selectedIdeas.length > 0 && !grid" class="bulk-actions-bar surface-100 border-round p-3 mb-3 flex align-items-center gap-3 flex-wrap">
      <div class="flex align-items-center gap-2">
        <i class="pi pi-check-square text-primary"></i>
        <span class="font-medium">{{ selectedIdeas.length }} selected</span>
      </div>
      
      <div class="flex-1"></div>
      
      <div class="flex align-items-center gap-2">
        <!-- Bulk Status Change -->
        <Dropdown 
          v-model="bulkStatus" 
          :options="statuses" 
          placeholder="Change Status"
          class="w-10rem"
        />
        <Button 
          label="Apply" 
          icon="pi pi-check"
          size="small"
          :disabled="!bulkStatus"
          @click="applyBulkStatus"
        />
        
        <!-- Bulk Delete -->
        <Button 
          label="Delete" 
          icon="pi pi-trash" 
          severity="danger"
          size="small"
          @click="confirmBulkDelete"
        />
        
        <!-- Clear Selection -->
        <Button 
          label="Clear" 
          icon="pi pi-times" 
          text
          size="small"
          @click="clearSelection"
        />
      </div>
    </div>

    <!-- Active Filters Summary -->
    <div v-if="hasActiveFilters" class="flex align-items-center gap-2 mb-3 text-600">
      <i class="pi pi-filter"></i>
      <span>Showing {{ filtered.length }} of {{ store.items.length }} ideas</span>
      <template v-if="search">
        <Tag severity="secondary" class="ml-2">
          Search: "{{ search }}"
          <i class="pi pi-times ml-1 cursor-pointer" @click="search = ''" />
        </Tag>
      </template>
      <template v-if="filters.status">
        <Tag severity="secondary">
          {{ filters.status }}
          <i class="pi pi-times ml-1 cursor-pointer" @click="filters.status = null" />
        </Tag>
      </template>
      <template v-if="filters.category">
        <Tag severity="secondary">
          {{ filters.category }}
          <i class="pi pi-times ml-1 cursor-pointer" @click="filters.category = null" />
        </Tag>
      </template>
    </div>

    <!-- Grid Skeleton (shown during loading) -->
    <div v-if="grid && showSkeleton" class="grid">
      <div v-for="n in 6" :key="n" class="col-12 md:col-6 lg:col-4">
        <div class="surface-card p-3 border-round shadow-1 h-full flex flex-column">
          <!-- Title + Vote button skeleton -->
          <div class="flex justify-content-between align-items-start mb-2">
            <Skeleton width="70%" height="1.5rem" />
            <Skeleton width="3rem" height="2.2rem" borderRadius="4px" />
          </div>
          <!-- Description skeleton -->
          <div class="mb-2 flex-1">
            <Skeleton width="100%" height="1rem" class="mb-2" />
            <Skeleton width="90%" height="1rem" class="mb-2" />
            <Skeleton width="60%" height="1rem" />
          </div>
          <!-- Tags skeleton -->
          <div class="flex gap-2 mb-2">
            <Skeleton width="5rem" height="1.5rem" borderRadius="1rem" />
            <Skeleton width="4rem" height="1.5rem" borderRadius="1rem" />
          </div>
          <!-- Tags text skeleton -->
          <Skeleton width="50%" height="0.9rem" class="mb-3" />
          <!-- Action buttons skeleton -->
          <div class="flex justify-content-end gap-1 mt-auto">
            <Skeleton shape="circle" size="2.2rem" />
            <Skeleton shape="circle" size="2.2rem" />
          </div>
        </div>
      </div>
    </div>

    <!-- Grid View (shown when data is loaded) -->
    <div v-else-if="grid" class="grid">
      <div v-for="idea in filtered" :key="idea.id" class="col-12 md:col-6 lg:col-4">
        <div class="surface-card p-3 border-round shadow-1 h-full flex flex-column">
          <div class="flex justify-content-between align-items-start mb-2">
            <h3 class="mt-0 mb-0 text-xl line-height-3 flex-1 mr-2">{{ idea.title }}</h3>
            <Button 
              :icon="hasVoted(idea.id) ? 'pi pi-check' : 'pi pi-angle-up'" 
              :class="['p-button-sm', { 'p-button-success': hasVoted(idea.id) }]"
              :disabled="votingId === idea.id || hasVoted(idea.id)"
              :loading="votingId === idea.id"
              v-tooltip.top="hasVoted(idea.id) ? 'Already voted' : 'Upvote'"
              @click="vote(idea)"
            >
              {{ idea.votes || 0 }}
            </Button>
          </div>
          <p class="text-600 mb-2 flex-1">{{ idea.description }}</p>
          <div class="flex gap-2 mb-2">
            <Tag :value="idea.category" severity="info" />
            <Tag :value="idea.status" :severity="statusSeverity(idea.status)" />
          </div>
          <div class="text-600 text-sm mb-3">
            Tags: {{ (idea.tags || []).join(', ') || '—' }}
          </div>
          <div class="flex justify-content-end gap-1 mt-auto">
            <Button icon="pi pi-pencil" severity="secondary" rounded text @click="editRow(idea)" v-tooltip.top="'Edit'" />
            <Button icon="pi pi-trash" severity="danger" rounded text @click="confirmDelete(idea)" v-tooltip.top="'Delete'" />
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="filtered.length === 0" class="col-12">
        <div class="surface-card p-5 border-round text-center text-600">
          <i class="pi pi-inbox text-4xl mb-3 block"></i>
          <p class="m-0">No ideas found. Try adjusting your filters or create a new idea.</p>
        </div>
      </div>
    </div>

    <!-- Skeleton Table (shown during loading) -->
    <DataTable 
      v-if="!grid && showSkeleton" 
      :value="skeletonRows" 
      class="p-datatable-sm"
    >
      <Column v-if="visibleColumns.title" header="Title" style="min-width: 200px">
        <template #body>
          <Skeleton width="70%" height="1.2rem" />
        </template>
      </Column>
      <Column v-if="visibleColumns.description" header="Description" style="min-width: 250px">
        <template #body>
          <Skeleton width="90%" height="1.2rem" />
        </template>
      </Column>
      <Column v-if="visibleColumns.category" header="Category" style="width: 130px">
        <template #body>
          <Skeleton width="5rem" height="1.5rem" borderRadius="1rem" />
        </template>
      </Column>
      <Column v-if="visibleColumns.status" header="Status" style="width: 120px">
        <template #body>
          <Skeleton width="4rem" height="1.5rem" borderRadius="1rem" />
        </template>
      </Column>
      <Column v-if="visibleColumns.votes" header="Votes" style="width: 100px">
        <template #body>
          <Skeleton width="3rem" height="2rem" borderRadius="4px" />
        </template>
      </Column>
      <Column v-if="visibleColumns.tags" header="Tags" style="width: 150px">
        <template #body>
          <Skeleton width="80%" height="1rem" />
        </template>
      </Column>
      <Column header="Actions" style="width: 100px">
        <template #body>
          <div class="flex gap-1">
            <Skeleton shape="circle" size="2rem" />
            <Skeleton shape="circle" size="2rem" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Table View (shown when data is loaded) -->
    <DataTable 
      v-else-if="!grid"
      v-model:selection="selectedIdeas"
      :value="filtered" 
      dataKey="id" 
      paginator 
      :rows="10" 
      :rowsPerPageOptions="[5, 10, 20, 50]"
      class="p-datatable-sm"
      stripedRows
      removableSort
    >
      <template #empty>
        <div class="p-4 text-center text-600">
          <i class="pi pi-inbox text-4xl mb-3 block"></i>
          <p class="m-0">No ideas found. Try adjusting your filters.</p>
        </div>
      </template>
      
      <!-- Selection Checkbox Column -->
      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      
      <Column v-if="visibleColumns.title" field="title" header="Title" sortable style="min-width: 200px">
        <template #body="{ data }">
          <span class="font-medium">{{ data.title }}</span>
        </template>
      </Column>
      
      <Column v-if="visibleColumns.description" field="description" header="Description" style="min-width: 250px">
        <template #body="{ data }">
          <span class="text-600 line-clamp">{{ data.description }}</span>
        </template>
      </Column>
      
      <Column v-if="visibleColumns.category" field="category" header="Category" sortable style="width: 130px">
        <template #body="{ data }">
          <Tag :value="data.category" severity="info" />
        </template>
      </Column>
      
      <Column v-if="visibleColumns.status" field="status" header="Status" sortable style="width: 120px">
        <template #body="{ data }">
          <Tag :value="data.status" :severity="statusSeverity(data.status)" />
        </template>
      </Column>
      
      <Column v-if="visibleColumns.votes" field="votes" header="Votes" sortable style="width: 100px">
        <template #body="{ data }">
          <Button 
            :icon="hasVoted(data.id) ? 'pi pi-check' : 'pi pi-angle-up'" 
            :class="['p-button-sm', { 'p-button-success': hasVoted(data.id) }]"
            :disabled="votingId === data.id || hasVoted(data.id)"
            :loading="votingId === data.id"
            v-tooltip.top="hasVoted(data.id) ? 'Already voted' : 'Upvote'"
            @click="vote(data)"
          >
            {{ data.votes || 0 }}
          </Button>
        </template>
      </Column>
      
      <Column v-if="visibleColumns.tags" field="tags" header="Tags" style="width: 150px">
        <template #body="{ data }">
          <span class="text-600 text-sm">{{ (data.tags || []).join(', ') || '—' }}</span>
        </template>
      </Column>
      
      <Column header="Actions" style="width: 100px" frozen alignFrozen="right">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button icon="pi pi-pencil" severity="secondary" rounded text @click="editRow(data)" v-tooltip.top="'Edit'" />
            <Button icon="pi pi-trash" severity="danger" rounded text @click="confirmDelete(data)" v-tooltip.top="'Delete'" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Edit Form Dialog -->
    <IdeaForm v-model="showForm" :value="editing" @submit="saveRow" />
    
    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog />
    
    <!-- Toast -->
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useIdeasStore } from '../stores/ideas'

// PrimeVue Components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Toolbar from 'primevue/toolbar'
import Dropdown from 'primevue/dropdown'
import ToggleButton from 'primevue/togglebutton'
import Menu from 'primevue/menu'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import Skeleton from 'primevue/skeleton'
import IdeaForm from './IdeaForm.vue'

const store = useIdeasStore()
const toast = useToast()
const confirm = useConfirm()

import { CATEGORIES, STATUSES, getStatusSeverity } from '../constants'

// Constants
const VOTED_KEY = 'pv_voted_ideas'
const categories = CATEGORIES
const statuses = STATUSES

// State
const search = ref('')
const filters = reactive({ status: null, category: null })
const grid = ref(false)
const votingId = ref(null)
const showForm = ref(false)
const editing = ref(null)
const columnMenu = ref(null)
const exportMenu = ref(null)
const showSkeleton = ref(true)

// Bulk actions state
const selectedIdeas = ref([])
const bulkStatus = ref(null)

// Skeleton placeholder rows
const skeletonRows = ref(new Array(5))

// Voted IDs tracking
const votedIds = ref(new Set())

function loadVotedIds() {
  try {
    const saved = localStorage.getItem(VOTED_KEY)
    if (saved) {
      votedIds.value = new Set(JSON.parse(saved))
    }
  } catch (e) {
    console.warn('Failed to load voted IDs:', e)
  }
}

function saveVotedId(id) {
  votedIds.value.add(id)
  localStorage.setItem(VOTED_KEY, JSON.stringify([...votedIds.value]))
}

function hasVoted(id) {
  return votedIds.value.has(id)
}

// Column visibility
const visibleColumns = reactive({
  title: true,
  description: true,
  category: true,
  status: true,
  votes: true,
  tags: false
})

const columnMenuItems = computed(() => [
  { 
    label: 'Title', 
    icon: visibleColumns.title ? 'pi pi-check' : 'pi pi-times',
    command: () => visibleColumns.title = !visibleColumns.title 
  },
  { 
    label: 'Description', 
    icon: visibleColumns.description ? 'pi pi-check' : 'pi pi-times',
    command: () => visibleColumns.description = !visibleColumns.description 
  },
  { 
    label: 'Category', 
    icon: visibleColumns.category ? 'pi pi-check' : 'pi pi-times',
    command: () => visibleColumns.category = !visibleColumns.category 
  },
  { 
    label: 'Status', 
    icon: visibleColumns.status ? 'pi pi-check' : 'pi pi-times',
    command: () => visibleColumns.status = !visibleColumns.status 
  },
  { 
    label: 'Votes', 
    icon: visibleColumns.votes ? 'pi pi-check' : 'pi pi-times',
    command: () => visibleColumns.votes = !visibleColumns.votes 
  },
  { 
    label: 'Tags', 
    icon: visibleColumns.tags ? 'pi pi-check' : 'pi pi-times',
    command: () => visibleColumns.tags = !visibleColumns.tags 
  }
])

function toggleColumnMenu(event) {
  columnMenu.value.toggle(event)
}

function toggleExportMenu(event) {
  exportMenu.value.toggle(event)
}

// Export Menu Items
const exportMenuItems = computed(() => {
  const count = selectedIdeas.value.length > 0 
    ? `${selectedIdeas.value.length} selected` 
    : `${filtered.value.length} ideas`
  
  return [
    {
      label: `Export CSV (${count})`,
      icon: 'pi pi-file',
      command: () => exportCSV()
    },
    {
      label: `Export JSON (${count})`,
      icon: 'pi pi-file-export',
      command: () => exportJSON()
    }
  ]
})

// Export Functions
function getExportData() {
  // Use selected items if any, otherwise use filtered list
  return selectedIdeas.value.length > 0 ? selectedIdeas.value : filtered.value
}

function convertToCSV(data) {
  if (data.length === 0) return ''
  
  const headers = ['Title', 'Description', 'Category', 'Status', 'Votes', 'Tags', 'Created At']
  const rows = data.map(idea => [
    `"${(idea.title || '').replace(/"/g, '""')}"`,
    `"${(idea.description || '').replace(/"/g, '""')}"`,
    idea.category || '',
    idea.status || '',
    idea.votes || 0,
    `"${(idea.tags || []).join(', ')}"`,
    idea.createdAt || ''
  ])
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function exportCSV() {
  const data = getExportData()
  if (data.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'No Data',
      detail: 'No ideas to export',
      life: 3000
    })
    return
  }
  
  const csv = convertToCSV(data)
  downloadFile(csv, 'ideas.csv', 'text/csv;charset=utf-8;')
  
  toast.add({
    severity: 'success',
    summary: 'Export Complete',
    detail: `Exported ${data.length} ideas to CSV`,
    life: 3000
  })
}

function exportJSON() {
  const data = getExportData()
  if (data.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'No Data',
      detail: 'No ideas to export',
      life: 3000
    })
    return
  }
  
  const json = JSON.stringify(data, null, 2)
  downloadFile(json, 'ideas.json', 'application/json')
  
  toast.add({
    severity: 'success',
    summary: 'Export Complete',
    detail: `Exported ${data.length} ideas to JSON`,
    life: 3000
  })
}

// Bulk Actions
function clearSelection() {
  selectedIdeas.value = []
  bulkStatus.value = null
}

async function applyBulkStatus() {
  if (!bulkStatus.value || selectedIdeas.value.length === 0) return
  
  const ids = selectedIdeas.value.map(i => i.id)
  const status = bulkStatus.value
  const count = ids.length
  
  try {
    await store.bulkSetStatus(ids, status)
    toast.add({
      severity: 'success',
      summary: 'Status Updated',
      detail: `Changed status to "${status}" for ${count} ideas`,
      life: 3000
    })
    clearSelection()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Update Failed',
      detail: e.message || 'Could not update status',
      life: 5000
    })
  }
}

function confirmBulkDelete() {
  const count = selectedIdeas.value.length
  confirm.require({
    message: `Are you sure you want to delete ${count} selected idea${count > 1 ? 's' : ''}?`,
    header: 'Confirm Bulk Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => executeBulkDelete(),
    reject: () => {}
  })
}

async function executeBulkDelete() {
  const ids = selectedIdeas.value.map(i => i.id)
  const count = ids.length
  
  try {
    await store.bulkDelete(ids)
    toast.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `Removed ${count} idea${count > 1 ? 's' : ''}`,
      life: 3000
    })
    clearSelection()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Delete Failed',
      detail: e.message || 'Could not delete ideas',
      life: 5000
    })
  }
}

// Computed
const filtered = computed(() => {
  let list = store.items
  const term = search.value.trim().toLowerCase()
  
  if (term) {
    list = list.filter(i => 
      [i.title, i.description, ...(i.tags || [])].some(v => 
        String(v).toLowerCase().includes(term)
      )
    )
  }
  
  if (filters.status) {
    list = list.filter(i => i.status === filters.status)
  }
  
  if (filters.category) {
    list = list.filter(i => i.category === filters.category)
  }
  
  return list
})

const hasActiveFilters = computed(() => 
  search.value || filters.status || filters.category
)

// Helpers
const statusSeverity = getStatusSeverity

function clearFilters() {
  search.value = ''
  filters.status = null
  filters.category = null
  toast.add({
    severity: 'info',
    summary: 'Filters Cleared',
    life: 2000
  })
}

// CRUD Operations
function openNew() {
  editing.value = { title: '', description: '', category: '', status: 'New', tags: [] }
  showForm.value = true
}

function editRow(row) {
  editing.value = { ...row }
  showForm.value = true
}

async function saveRow(formData) {
  try {
    if (editing.value?.id) {
      await store.patch(editing.value.id, formData)
      toast.add({
        severity: 'success',
        summary: 'Idea Updated',
        detail: `"${formData.title}" has been updated`,
        life: 3000
      })
    } else {
      await store.add(formData)
      toast.add({
        severity: 'success',
        summary: 'Idea Created',
        detail: `"${formData.title}" has been added`,
        life: 3000
      })
    }
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: e.message || 'Operation failed',
      life: 5000
    })
  }
}

function confirmDelete(row) {
  confirm.require({
    message: `Are you sure you want to delete "${row.title}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => removeRow(row),
    reject: () => {}
  })
}

async function removeRow(row) {
  try {
    await store.remove(row.id)
    toast.add({
      severity: 'success',
      summary: 'Idea Deleted',
      detail: `"${row.title}" has been removed`,
      life: 3000
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Delete Failed',
      detail: e.message || 'Could not delete idea',
      life: 5000
    })
  }
}

// Voting
async function vote(row) {
  if (hasVoted(row.id)) {
    toast.add({
      severity: 'warn',
      summary: 'Already Voted',
      detail: 'You have already upvoted this idea',
      life: 3000
    })
    return
  }
  
  votingId.value = row.id
  try {
    await store.upvoteIdea(row.id)
    saveVotedId(row.id)
    toast.add({
      severity: 'success',
      summary: 'Vote Recorded',
      detail: `Thanks for voting on "${row.title}"`,
      life: 2000
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Vote Failed',
      detail: e.message || 'Could not record vote',
      life: 5000
    })
  } finally {
    votingId.value = null
  }
}

// Refresh
async function handleRefresh() {
  showSkeleton.value = true
  await store.refresh()
  showSkeleton.value = false
  toast.add({
    severity: 'info',
    summary: 'Refreshed',
    detail: `${store.items.length} ideas loaded`,
    life: 2000
  })
}

// Lifecycle
onMounted(async () => {
  loadVotedIds()
  await store.refresh()
  showSkeleton.value = false
})
</script>

<style scoped>
.card {
  background: var(--surface-card);
  border-radius: var(--border-radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.bulk-actions-bar {
  border: 1px solid var(--surface-border);
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem;
}

:deep(.p-datatable .p-datatable-tbody > tr.p-highlight) {
  background: var(--primary-color);
  background: color-mix(in srgb, var(--primary-color) 15%, transparent);
}

:deep(.p-toolbar) {
  padding: 0.75rem;
  gap: 0.5rem;
}

:deep(.p-button.p-button-success) {
  background: var(--green-500);
  border-color: var(--green-500);
}
</style>
