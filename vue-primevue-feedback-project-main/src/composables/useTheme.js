
import { ref, watch } from 'vue'

const THEME_KEY = 'pv_theme'
const LIGHT_THEME = 'saga-blue'
const DARK_THEME = 'arya-blue'

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

// Apply theme by swapping CSS link
function applyTheme() {
  const theme = isDark.value ? DARK_THEME : LIGHT_THEME
  const linkId = 'theme-link'
  
  let link = document.getElementById(linkId)
  
  if (!link) {
    // Create link element if it doesn't exist
    link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  
  link.href = `https://unpkg.com/primevue@3/resources/themes/${theme}/theme.css`
  
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