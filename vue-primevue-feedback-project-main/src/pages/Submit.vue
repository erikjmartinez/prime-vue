<template>
  <div class="surface-card p-4 md:p-5 border-round shadow-2 max-w-screen-lg mx-auto">
    <!-- Header -->
    <div class="mb-4">
      <h1 class="mt-0 mb-2 text-2xl md:text-3xl">Submit New Idea</h1>
      <p class="text-600 mt-0 mb-0">Share your feature request or improvement suggestion.</p>
    </div>

    <!-- Validation Summary -->
    <Message v-if="showSummary && errorCount > 0" severity="error" :closable="false" class="mb-4">
      <div class="flex align-items-center gap-2">
        <span>Please fix {{ errorCount }} error{{ errorCount > 1 ? 's' : '' }} before submitting.</span>
      </div>
    </Message>

    <!-- Draft Restored Notice -->
    <Message v-if="draftRestored" severity="info" :closable="true" @close="draftRestored = false" class="mb-4">
      <div class="flex align-items-center gap-2">
        <span>Draft restored from your previous session.</span>
      </div>
    </Message>

    <form @submit.prevent="submit" novalidate>
      <!-- Section 1: Idea Basics -->
      <Panel header="Idea Basics" class="mb-4" toggleable>
        <template #icons>
          <span class="text-600 text-sm">* Required</span>
        </template>
        <div class="grid">
          <!-- Title -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="title" class="block font-medium mb-2">
                Title <span class="text-red-500">*</span>
              </label>
              <InputText
                id="title"
                v-model="form.title"
                :class="{ 'p-invalid': errors.title }"
                class="w-full"
                aria-describedby="title-help title-error"
                placeholder="Brief, descriptive title"
                @blur="validateField('title')"
              />
              <small id="title-help" class="block text-600 mt-1">Keep it concise (5-100 characters)</small>
              <small id="title-error" class="block text-red-500 mt-1" v-if="errors.title">
                <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.title }}
              </small>
            </div>
          </div>

          <!-- Category -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="category" class="block font-medium mb-2">
                Category <span class="text-red-500">*</span>
              </label>
              <Dropdown
                id="category"
                v-model="form.category"
                :options="categories"
                :class="{ 'p-invalid': errors.category }"
                class="w-full"
                placeholder="Select a category"
                aria-describedby="category-error"
                @change="validateField('category')"
              />
              <small id="category-error" class="block text-red-500 mt-1" v-if="errors.category">
                <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.category }}
              </small>
            </div>
          </div>

          <!-- Description -->
          <div class="col-12">
            <div class="field">
              <label for="desc" class="block font-medium mb-2">
                Description <span class="text-red-500">*</span>
              </label>
              <Textarea
                id="desc"
                v-model="form.description"
                :class="{ 'p-invalid': errors.description }"
                class="w-full"
                rows="4"
                autoResize
                aria-describedby="desc-help desc-error"
                placeholder="Describe the problem you're solving and your proposed solution..."
                @blur="validateField('description')"
              />
              <div class="flex justify-content-between mt-1">
                <small id="desc-help" class="text-600">Minimum 20 characters</small>
                <small :class="descriptionLength > 500 ? 'text-orange-500' : 'text-600'">
                  {{ descriptionLength }}/1000
                </small>
              </div>
              <small id="desc-error" class="block text-red-500 mt-1" v-if="errors.description">
                <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.description }}
              </small>
            </div>
          </div>

          <!-- Tags -->
          <div class="col-12">
            <div class="field">
              <label for="tags" class="block font-medium mb-2">Tags</label>
              <Chips
                id="tags"
                v-model="form.tags"
                separator=","
                class="w-full"
                aria-describedby="tags-help"
                placeholder="Type and press Enter to add"
              />
              <small id="tags-help" class="block text-600 mt-1">Add keywords to help others find this idea</small>
            </div>
          </div>
        </div>
      </Panel>

      <!-- Section 2: Impact & Priority -->
      <Panel header="Impact & Priority" class="mb-4" toggleable>
        <div class="grid">
          <!-- Target Personas -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="personas" class="block font-medium mb-2">Target Personas</label>
              <MultiSelect
                id="personas"
                v-model="form.personas"
                :options="personas"
                optionLabel="label"
                optionValue="label"
                display="chip"
                class="w-full"
                placeholder="Who benefits from this?"
                aria-describedby="personas-help"
                :showToggleAll="false"
              />
              <small id="personas-help" class="block text-600 mt-1">Select all user types that would benefit</small>
            </div>
          </div>

          <!-- Impact Score -->
          <div class="col-12 md:col-3">
            <div class="field">
              <label for="impact" class="block font-medium mb-2">Impact Score</label>
              <div class="pt-2">
                <Slider id="impact" v-model="form.impact" :min="0" :max="10" class="w-full" />
              </div>
              <div class="flex justify-content-between mt-2">
                <small class="text-600">Low</small>
                <span class="font-bold text-primary">{{ form.impact }}/10</span>
                <small class="text-600">High</small>
              </div>
            </div>
          </div>

          <!-- Expected Reach -->
          <div class="col-12 md:col-3">
            <div class="field">
              <label for="reach" class="block font-medium mb-2">Expected Reach</label>
              <InputNumber
                id="reach"
                v-model="form.reach"
                :min="0"
                :step="100"
                class="w-full"
                placeholder="# of users"
                aria-describedby="reach-help"
              />
              <small id="reach-help" class="block text-600 mt-1">Estimated users impacted</small>
            </div>
          </div>

          <!-- Target Date -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="targetDate" class="block font-medium mb-2">Target Date</label>
              <Calendar
                id="targetDate"
                v-model="form.targetDate"
                showIcon
                :minDate="minDate"
                :manualInput="false"
                class="w-full"
                dateFormat="mm/dd/yy"
                placeholder="When should this ship?"
                aria-describedby="date-help"
                showButtonBar
              />
              <small id="date-help" class="block text-600 mt-1">Optional: desired delivery date</small>
            </div>
          </div>
        </div>
      </Panel>

      <!-- Section 3: Technical -->
      <Panel header="Technical Details" class="mb-4" toggleable>
        <div class="grid">
          <!-- Complexity -->
          <div class="col-12 md:col-4">
            <div class="field">
              <label for="complexity" class="block font-medium mb-2">Complexity</label>
              <Dropdown
                id="complexity"
                v-model="form.complexity"
                :options="complexityOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                placeholder="Estimated effort"
              />
            </div>
          </div>

          <!-- Dependencies -->
          <div class="col-12 md:col-4">
            <div class="field">
              <label for="dependencies" class="block font-medium mb-2">Dependencies</label>
              <Chips
                id="dependencies"
                v-model="form.dependencies"
                class="w-full"
                placeholder="Related features/systems"
                aria-describedby="deps-help"
              />
              <small id="deps-help" class="block text-600 mt-1">Other features this depends on</small>
            </div>
          </div>

          <!-- Repository URL -->
          <div class="col-12 md:col-4">
            <div class="field">
              <label for="repo" class="block font-medium mb-2">Repository URL</label>
              <InputText
                id="repo"
                v-model="form.repoUrl"
                :class="{ 'p-invalid': errors.repoUrl }"
                class="w-full"
                placeholder="https://github.com/org/repo"
                aria-describedby="repo-error"
                @blur="validateField('repoUrl')"
              />
              <small id="repo-error" class="block text-red-500 mt-1" v-if="errors.repoUrl">
                <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.repoUrl }}
              </small>
            </div>
          </div>

          <!-- Privacy -->
          <div class="col-12">
            <div class="field">
              <label class="block font-medium mb-3">Visibility</label>
              <div class="flex flex-wrap gap-4">
                <div class="flex align-items-center gap-2">
                  <RadioButton inputId="privacy-public" name="privacy" value="public" v-model="form.privacy" />
                  <label for="privacy-public" class="cursor-pointer">
                    <i class="pi pi-globe mr-1"></i>Public
                  </label>
                </div>
                <div class="flex align-items-center gap-2">
                  <RadioButton inputId="privacy-internal" name="privacy" value="internal" v-model="form.privacy" />
                  <label for="privacy-internal" class="cursor-pointer">
                    <i class="pi pi-lock mr-1"></i>Internal Only
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <!-- Section 4: Contact & Meta -->
      <Panel header="Contact Information" class="mb-4" toggleable>
        <div class="grid">
          <!-- Requester Name -->
          <div class="col-12 md:col-4">
            <div class="field">
              <label for="name" class="block font-medium mb-2">
                Your Name <span class="text-red-500">*</span>
              </label>
              <InputText
                id="name"
                v-model="form.requester.name"
                :class="{ 'p-invalid': errors.requesterName }"
                class="w-full"
                placeholder="John Doe"
                aria-describedby="name-error"
                @blur="validateField('requesterName')"
              />
              <small id="name-error" class="block text-red-500 mt-1" v-if="errors.requesterName">
                <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.requesterName }}
              </small>
            </div>
          </div>

          <!-- Requester Email -->
          <div class="col-12 md:col-4">
            <div class="field">
              <label for="email" class="block font-medium mb-2">
                Your Email <span class="text-red-500">*</span>
              </label>
              <InputText
                id="email"
                v-model="form.requester.email"
                :class="{ 'p-invalid': errors.requesterEmail }"
                class="w-full"
                type="email"
                placeholder="john@example.com"
                aria-describedby="email-error"
                @blur="validateField('requesterEmail')"
              />
              <small id="email-error" class="block text-red-500 mt-1" v-if="errors.requesterEmail">
                <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.requesterEmail }}
              </small>
            </div>
          </div>

          <!-- Notifications -->
          <div class="col-12 md:col-4">
            <div class="field">
              <label for="notify" class="block font-medium mb-2">Email Notifications</label>
              <div class="flex align-items-center gap-2 pt-2">
                <InputSwitch id="notify" v-model="form.notify" />
                <label for="notify" class="cursor-pointer">Notify me of updates</label>
              </div>
            </div>
          </div>

          <!-- Terms -->
          <div class="col-12">
            <div class="field">
              <div class="flex align-items-start gap-2">
                <Checkbox
                  inputId="terms"
                  v-model="form.terms"
                  :binary="true"
                  :class="{ 'p-invalid': errors.terms }"
                  aria-describedby="terms-error"
                  @change="validateField('terms')"
                />
                <label for="terms" class="cursor-pointer line-height-3">
                  I confirm the information provided is accurate and I have the authority to submit this request.
                  <span class="text-red-500">*</span>
                </label>
              </div>
              <small id="terms-error" class="block text-red-500 mt-1 ml-4" v-if="errors.terms">
                <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.terms }}
              </small>
            </div>
          </div>
        </div>
      </Panel>

      <!-- Actions -->
      <div class="flex flex-wrap justify-content-between align-items-center gap-3 pt-3 border-top-1 surface-border">
        <div class="flex align-items-center gap-2 text-600">
          <i class="pi pi-info-circle"></i>
          <small>Your progress is auto-saved as a draft</small>
        </div>
        <div class="flex gap-2">
          <Button
            type="button"
            label="Clear Form"
            icon="pi pi-refresh"
            severity="secondary"
            text
            @click="clearForm"
          />
          <Button
            type="button"
            label="Save Draft"
            icon="pi pi-save"
            severity="secondary"
            outlined
            @click="saveDraft"
          />
          <Button
            type="submit"
            label="Submit Idea"
            icon="pi pi-send"
            :loading="submitting"
          />
        </div>
      </div>
    </form>
  </div>

  <Toast position="top-right" />
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useIdeasStore } from '../stores/ideas'

// PrimeVue Components
import Panel from 'primevue/panel'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Chips from 'primevue/chips'
import MultiSelect from 'primevue/multiselect'
import Slider from 'primevue/slider'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import InputSwitch from 'primevue/inputswitch'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Toast from 'primevue/toast'

const router = useRouter()
const toast = useToast()
const store = useIdeasStore()

import { CATEGORIES, PERSONAS, COMPLEXITY_OPTIONS } from '../constants'

// Constants
const DRAFT_KEY = 'draft_submit_idea'
const categories = CATEGORIES
const personas = PERSONAS
const complexityOptions = COMPLEXITY_OPTIONS
const minDate = new Date()

// Form State
const initialForm = () => ({
  title: '',
  description: '',
  category: '',
  tags: [],
  personas: [],
  impact: 5,
  reach: 0,
  targetDate: null,
  complexity: '',
  dependencies: [],
  repoUrl: '',
  privacy: 'internal',
  requester: { name: '', email: '' },
  notify: false,
  terms: false
})

const form = reactive(initialForm())
const errors = reactive({
  title: '',
  category: '',
  description: '',
  repoUrl: '',
  requesterName: '',
  requesterEmail: '',
  terms: ''
})

const submitting = ref(false)
const showSummary = ref(false)
const draftRestored = ref(false)

// Computed
const descriptionLength = computed(() => form.description.length)
const errorCount = computed(() => Object.values(errors).filter(e => e).length)

// Validation Rules
const validators = {
  title: (val) => {
    if (!val?.trim()) return 'Title is required'
    if (val.trim().length < 5) return 'Title must be at least 5 characters'
    if (val.trim().length > 100) return 'Title must be less than 100 characters'
    return ''
  },
  category: (val) => (!val ? 'Please select a category' : ''),
  description: (val) => {
    if (!val?.trim()) return 'Description is required'
    if (val.trim().length < 20) return 'Description must be at least 20 characters'
    if (val.trim().length > 1000) return 'Description must be less than 1000 characters'
    return ''
  },
  repoUrl: (val) => {
    if (!val) return ''
    const urlPattern = /^https?:\/\/.+/i
    return urlPattern.test(val) ? '' : 'Please enter a valid URL'
  },
  requesterName: (val) => (!val?.trim() ? 'Your name is required' : ''),
  requesterEmail: (val) => {
    if (!val?.trim()) return 'Email is required'
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(val) ? '' : 'Please enter a valid email'
  },
  terms: (val) => (!val ? 'You must confirm the information is accurate' : '')
}

// Field Validation
function validateField(field) {
  const valueMap = {
    title: form.title,
    category: form.category,
    description: form.description,
    repoUrl: form.repoUrl,
    requesterName: form.requester.name,
    requesterEmail: form.requester.email,
    terms: form.terms
  }
  if (validators[field]) {
    errors[field] = validators[field](valueMap[field])
  }
}

// Full Validation
function validateAll() {
  Object.keys(validators).forEach(validateField)
  showSummary.value = true
  return errorCount.value === 0
}

// Draft Management
function saveDraft() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
  toast.add({
    severity: 'success',
    summary: 'Draft Saved',
    detail: 'Your progress has been saved locally',
    life: 3000
  })
}

function hasMeaningfulData(data) {
  // Check if draft has any real user input
  return (
    data.title?.trim() ||
    data.description?.trim() ||
    data.category ||
    data.tags?.length > 0 ||
    data.personas?.length > 0 ||
    data.requester?.name?.trim() ||
    data.requester?.email?.trim()
  )
}

function loadDraft() {
  try {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Only restore and notify if there's meaningful data
      if (hasMeaningfulData(parsed)) {
        Object.assign(form, {
          ...initialForm(),
          ...parsed,
          requester: { ...initialForm().requester, ...parsed.requester },
          targetDate: parsed.targetDate ? new Date(parsed.targetDate) : null
        })
        draftRestored.value = true
      }
    }
  } catch (e) {
    console.warn('Failed to load draft:', e)
  }
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}

function clearForm() {
  Object.assign(form, initialForm())
  Object.keys(errors).forEach(key => errors[key] = '')
  showSummary.value = false
  clearDraft()
  toast.add({
    severity: 'info',
    summary: 'Form Cleared',
    detail: 'All fields have been reset',
    life: 3000
  })
}

// Auto-save draft on changes (debounced via watch)
let saveTimeout = null
watch(
  () => ({ ...form }),
  () => {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
    }, 1000)
  },
  { deep: true }
)

// Submit
async function submit() {
  if (!validateAll()) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: `Please fix ${errorCount.value} error${errorCount.value > 1 ? 's' : ''} before submitting`,
      life: 5000
    })
    // Focus first error field
    const firstErrorField = Object.keys(errors).find(k => errors[k])
    if (firstErrorField) {
      const fieldId = firstErrorField === 'requesterName' ? 'name' 
        : firstErrorField === 'requesterEmail' ? 'email' 
        : firstErrorField === 'description' ? 'desc'
        : firstErrorField
      document.getElementById(fieldId)?.focus()
    }
    return
  }

  submitting.value = true
  try {
    // Prepare data for store
    const ideaData = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      tags: form.tags,
      status: 'New',
      // Store additional metadata
      meta: {
        personas: form.personas,
        impact: form.impact,
        reach: form.reach,
        targetDate: form.targetDate,
        complexity: form.complexity,
        dependencies: form.dependencies,
        repoUrl: form.repoUrl,
        privacy: form.privacy,
        requester: form.requester,
        notify: form.notify
      }
    }

    await store.add(ideaData)
    clearDraft()

    toast.add({
      severity: 'success',
      summary: 'Idea Submitted!',
      detail: 'Your idea has been added successfully',
      life: 4000
    })

    // Navigate to ideas list after short delay
    setTimeout(() => router.push('/ideas'), 1500)
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Submission Failed',
      detail: e.message || 'Please try again',
      life: 5000
    })
  } finally {
    submitting.value = false
  }
}

// Load draft on mount
onMounted(() => {
  loadDraft()
})
</script>

<style scoped>
.field {
  margin-bottom: 0;
}

/* Panel content padding */
:deep(.p-panel-content) {
  padding: 1.25rem;
}

/* Chips input width */
:deep(.p-chips-input-token input) {
  width: 100%;
}

/* Form inputs full width */
:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-multiselect),
:deep(.p-calendar),
:deep(.p-inputnumber) {
  width: 100%;
}
</style>
