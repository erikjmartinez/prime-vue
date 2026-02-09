<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="mb-4">
      <h1 class="mt-0 mb-2 text-2xl md:text-3xl">Dashboard</h1>
      <p class="text-600 mt-0 mb-0">Overview of feature requests and ideas</p>
    </div>

    <!-- KPI Cards Row -->
    <div class="grid mb-4">
      <!-- Total Ideas -->
      <div class="col-12 sm:col-6 lg:col-3">
        <div class="surface-card p-4 border-round shadow-1 h-full">
          <div class="flex align-items-center justify-content-between mb-3">
            <span class="text-500 font-medium">Total Ideas</span>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
              <i class="pi pi-bolt text-blue-500 text-xl"></i>
            </div>
          </div>
          <div class="text-3xl font-bold text-900 mb-2">{{ stats.total }}</div>
          <span class="text-500 text-sm">All submitted ideas</span>
        </div>
      </div>

      <!-- New This Month -->
      <div class="col-12 sm:col-6 lg:col-3">
        <div class="surface-card p-4 border-round shadow-1 h-full">
          <div class="flex align-items-center justify-content-between mb-3">
            <span class="text-500 font-medium">New This Month</span>
            <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width: 2.5rem; height: 2.5rem">
              <i class="pi pi-calendar-plus text-green-500 text-xl"></i>
            </div>
          </div>
          <div class="text-3xl font-bold text-900 mb-2">{{ stats.newThisMonth }}</div>
          <span class="text-500 text-sm">Since {{ currentMonthName }}</span>
        </div>
      </div>

      <!-- Total Votes -->
      <div class="col-12 sm:col-6 lg:col-3">
        <div class="surface-card p-4 border-round shadow-1 h-full">
          <div class="flex align-items-center justify-content-between mb-3">
            <span class="text-500 font-medium">Total Votes</span>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
              <i class="pi pi-thumbs-up text-orange-500 text-xl"></i>
            </div>
          </div>
          <div class="text-3xl font-bold text-900 mb-2">{{ stats.totalVotes }}</div>
          <span class="text-500 text-sm">Community engagement</span>
        </div>
      </div>

      <!-- In Progress -->
      <div class="col-12 sm:col-6 lg:col-3">
        <div class="surface-card p-4 border-round shadow-1 h-full">
          <div class="flex align-items-center justify-content-between mb-3">
            <span class="text-500 font-medium">In Progress</span>
            <div class="flex align-items-center justify-content-center border-round kpi-in-progress" style="width: 2.5rem; height: 2.5rem">
              <i class="pi pi-sync text-xl" style="color: #FBC02D"></i>
            </div>
          </div>
          <div class="text-3xl font-bold text-900 mb-2">{{ stats.byStatus['In Progress'] || 0 }}</div>
          <span class="text-500 text-sm">Currently being worked on</span>
        </div>
      </div>
    </div>

    <!-- Charts and Most Voted Row -->
    <div class="grid">
      <!-- Status Distribution Chart -->
      <div class="col-12 lg:col-8">
        <div class="surface-card p-4 border-round shadow-1 h-full">
          <h3 class="mt-0 mb-4 text-xl">Ideas by Status</h3>
          <div class="chart-container">
            <Chart type="bar" :data="chartData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Most Voted Idea -->
      <div class="col-12 lg:col-4">
        <div class="surface-card p-4 border-round shadow-1 h-full">
          <h3 class="mt-0 mb-4 text-xl">
            <i class="pi pi-star-fill text-yellow-500 mr-2"></i>
            Most Voted Idea
          </h3>
          
          <div v-if="stats.mostVoted" class="most-voted-card">
            <div class="flex align-items-center justify-content-between mb-3">
              <Tag :value="stats.mostVoted.category" severity="info" />
              <Tag :value="stats.mostVoted.status" :severity="statusSeverity(stats.mostVoted.status)" />
            </div>
            
            <h4 class="mt-0 mb-2 text-lg line-height-3">{{ stats.mostVoted.title }}</h4>
            <p class="text-600 mb-3 line-height-3">{{ stats.mostVoted.description }}</p>
            
            <div class="flex align-items-center justify-content-between">
              <div class="flex align-items-center gap-2 text-600">
                <i class="pi pi-tag"></i>
                <span class="text-sm">{{ (stats.mostVoted.tags || []).join(', ') || 'No tags' }}</span>
              </div>
              <div class="vote-badge">
                <i class="pi pi-thumbs-up mr-1"></i>
                <span class="font-bold">{{ stats.mostVoted.votes }}</span>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center text-600 py-5">
            <i class="pi pi-inbox text-4xl mb-3 block"></i>
            <p class="m-0">No ideas yet</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Breakdown Cards -->
    <div class="grid mt-4">
      <div class="col-12">
        <h3 class="mt-0 mb-3 text-xl">Status Breakdown</h3>
      </div>
      <div v-for="status in statusList" :key="status.name" class="col-6 sm:col-3">
        <div 
          class="surface-card p-3 border-round shadow-1 text-center cursor-pointer hover:shadow-3 transition-all transition-duration-200"
          @click="navigateToIdeas(status.name)"
        >
          <div 
            class="flex align-items-center justify-content-center mx-auto mb-2 border-round"
            :class="status.bgClass"
            style="width: 3rem; height: 3rem"
          >
            <i :class="[status.icon, status.textClass, 'text-xl']"></i>
          </div>
          <div class="text-2xl font-bold mb-1">{{ stats.byStatus[status.name] || 0 }}</div>
          <div class="text-600 text-sm">{{ status.name }}</div>
        </div>
      </div>
    </div>

    <!-- Recent Ideas Section -->
    <div class="grid mt-4">
      <div class="col-12">
        <div class="surface-card p-4 border-round shadow-1">
          <div class="flex align-items-center justify-content-between mb-4">
            <h3 class="mt-0 mb-0 text-xl">Recent Ideas</h3>
            <Button label="View All" icon="pi pi-arrow-right" iconPos="right" text @click="router.push('/ideas')" />
          </div>
          
          <div v-if="recentIdeas.length > 0" class="grid">
            <div v-for="idea in recentIdeas" :key="idea.id" class="col-12 md:col-6 lg:col-4">
              <div class="border-1 surface-border border-round p-3">
                <div class="flex align-items-center justify-content-between mb-2">
                  <Tag :value="idea.status" :severity="statusSeverity(idea.status)" />
                  <span class="text-600 text-sm">{{ formatDate(idea.createdAt) }}</span>
                </div>
                <h4 class="mt-0 mb-2 text-base line-height-3">{{ idea.title }}</h4>
                <p class="text-600 text-sm mb-0 line-clamp-2">{{ idea.description }}</p>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center text-600 py-4">
            <p class="m-0">No ideas submitted yet. Be the first!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIdeasStore } from '../stores/ideas'

// PrimeVue Components
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Chart from 'primevue/chart'

const router = useRouter()
const store = useIdeasStore()

// Ensure data is loaded
onMounted(() => {
  if (store.items.length === 0) {
    store.refresh()
  }
})

// Stats from store
const stats = computed(() => store.stats)

// Current month name
const currentMonthName = computed(() => {
  return new Date().toLocaleString('default', { month: 'long' })
})

// Status list with styling (colors match KPI cards and chart)
const statusList = [
  { name: 'New', icon: 'pi pi-star', bgClass: 'bg-gray-100', textClass: 'text-gray-600' },
  { name: 'Planned', icon: 'pi pi-calendar', bgClass: 'bg-blue-100', textClass: 'text-blue-500' },
  { name: 'In Progress', icon: 'pi pi-sync', bgClass: 'status-in-progress-bg', textClass: 'status-in-progress-text' },
  { name: 'Done', icon: 'pi pi-check-circle', bgClass: 'bg-green-100', textClass: 'text-green-500' }
]

// Recent ideas (last 3)
const recentIdeas = computed(() => {
  return [...store.items]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
})

// Chart data (colors match KPI cards and status breakdown)
const chartData = computed(() => {
  const statuses = ['New', 'Planned', 'In Progress', 'Done']
  const colors = {
    'New': { bg: 'rgba(107, 114, 128, 0.7)', border: 'rgb(107, 114, 128)' },        // Gray
    'Planned': { bg: 'rgba(59, 130, 246, 0.7)', border: 'rgb(59, 130, 246)' },      // Blue
    'In Progress': { bg: 'rgba(251, 192, 45, 0.7)', border: 'rgb(251, 192, 45)' },  // Yellow #FBC02D
    'Done': { bg: 'rgba(34, 197, 94, 0.7)', border: 'rgb(34, 197, 94)' }            // Green
  }
  
  return {
    labels: statuses,
    datasets: [
      {
        label: 'Ideas',
        data: statuses.map(s => stats.value.byStatus[s] || 0),
        backgroundColor: statuses.map(s => colors[s].bg),
        borderColor: statuses.map(s => colors[s].border),
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

import { getStatusSeverity } from '../constants'

// Helpers
const statusSeverity = getStatusSeverity

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function navigateToIdeas(status) {
  router.push({ path: '/ideas', query: { status } })
}
</script>

<style scoped>
/* Custom yellow color for "In Progress" status (#FBC02D) */
.kpi-in-progress {
  background-color: rgba(251, 192, 45, 0.2);
}

.status-in-progress-bg {
  background-color: rgba(251, 192, 45, 0.2);
}

.status-in-progress-text {
  color: #FBC02D;
}

.chart-container {
  height: 300px;
}

.most-voted-card {
  background: linear-gradient(135deg, var(--surface-50) 0%, var(--surface-100) 100%);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.vote-badge {
  display: flex;
  align-items: center;
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.hover\:shadow-3:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
