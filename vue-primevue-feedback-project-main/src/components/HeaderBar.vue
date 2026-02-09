<template>
  <header class="surface-0 shadow-1 sticky top-0 z-5">
    <div class="px-3 lg:px-5 py-2 flex align-items-center justify-content-between">
      <!-- Logo / Brand -->
      <div class="flex align-items-center gap-2">
        <i class="pi pi-comments text-primary text-2xl"></i>
        <router-link to="/dashboard" class="text-xl font-bold text-color no-underline hover:text-primary">
          Ideas
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="flex align-items-center gap-1">
        <router-link 
          v-for="link in navLinks" 
          :key="link.to" 
          :to="link.to"
          class="nav-link"
          :class="{ 'nav-link-active': isActive(link.to) }"
        >
          <i :class="link.icon" class="mr-2 hidden sm:inline"></i>
          <span>{{ link.label }}</span>
        </router-link>

        <!-- Theme Toggle -->
        <div class="ml-2 pl-2 border-left-1 surface-border">
          <Button
            :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            :class="isDark ? 'p-button-warning' : 'p-button-secondary'"
            rounded
            text
            @click="handleThemeToggle"
            v-tooltip.bottom="themeTooltip"
            :aria-label="themeTooltip"
            :aria-pressed="isDark"
            role="switch"
          />
        </div>
        
        <!-- Screen reader announcement (live region) -->
        <div 
          aria-live="polite" 
          aria-atomic="true" 
          class="sr-only"
        >
          {{ announcement }}
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import Button from 'primevue/button'

const route = useRoute()
const { isDark, toggleTheme } = useTheme()

// Global keyboard shortcut for theme toggle (Ctrl+Shift+L)
function handleGlobalKeydown(e) {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
    e.preventDefault()
    handleThemeToggle()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: 'pi pi-chart-bar' },
  { to: '/ideas', label: 'Ideas', icon: 'pi pi-list' },
  { to: '/submit', label: 'Submit', icon: 'pi pi-plus' },
  { to: '/style-guide', label: 'Style Guide', icon: 'pi pi-palette' }
]

function isActive(path) {
  return route.path === path
}

// Theme accessibility
const announcement = ref('')
const themeTooltip = computed(() => 
  isDark.value ? 'Switch to Light Mode (Ctrl+Shift+L)' : 'Switch to Dark Mode (Ctrl+Shift+L)'
)

function handleThemeToggle() {
  toggleTheme()
  // Announce to screen readers
  announcement.value = isDark.value ? 'Dark mode enabled' : 'Light mode enabled'
  // Clear after announcement
  setTimeout(() => { announcement.value = '' }, 1000)
}
</script>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius);
  color: var(--text-color-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: var(--surface-hover);
  color: var(--text-color);
}

.nav-link-active {
  background: var(--primary-color);
  color: var(--primary-color-text);
}

.nav-link-active:hover {
  background: var(--primary-color);
  color: var(--primary-color-text);
}

/* Screen reader only - visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
