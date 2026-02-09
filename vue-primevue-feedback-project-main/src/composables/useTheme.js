import { ref, watch } from 'vue'

const THEME_KEY = 'pv_theme'
const DARK_CLASS = 'dark-mode'

// Reactive theme state (shared across components)
const isDark = ref(false)

// Initialize from localStorage or system preference
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved) {
    isDark.value = saved === 'dark'
  } else {
    // Check system preference
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
}

// Apply theme by toggling class on <html> element
function applyTheme() {
  if (isDark.value) {
    document.documentElement.classList.add(DARK_CLASS)
  } else {
    document.documentElement.classList.remove(DARK_CLASS)
  }
  // Save preference
  localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
}

// Toggle theme
function toggleTheme() {
  isDark.value = !isDark.value
}

// Watch for changes
watch(isDark, applyTheme)

export function useTheme() {
  return {
    isDark,
    toggleTheme,
    initTheme
  }
}
