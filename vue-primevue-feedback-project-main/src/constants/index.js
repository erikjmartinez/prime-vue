/**
 * Shared constants used across the application
 */

// Idea categories
export const CATEGORIES = ['Platform', 'UI', 'Performance', 'Integrations', 'Security']

// Idea statuses
export const STATUSES = ['New', 'Planned', 'In Progress', 'Done']

// Target personas for ideas
export const PERSONAS = [
  { label: 'Admin' },
  { label: 'Developer' },
  { label: 'Analyst' },
  { label: 'End User' }
]

// Complexity options for technical section
export const COMPLEXITY_OPTIONS = [
  { label: 'Low - Quick win', value: 'Low' },
  { label: 'Medium - Some effort', value: 'Medium' },
  { label: 'High - Major undertaking', value: 'High' }
]

// Status to PrimeVue severity mapping
export const STATUS_SEVERITY_MAP = {
  'Done': 'success',
  'In Progress': 'warning',
  'Planned': 'info',
  'New': 'secondary'
}

/**
 * Get PrimeVue severity for a status
 * @param {string} status - The idea status
 * @returns {string} PrimeVue severity
 */
export function getStatusSeverity(status) {
  return STATUS_SEVERITY_MAP[status] || 'secondary'
}

