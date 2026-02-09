<template>
  <Dialog 
    v-model:visible="visible" 
    :header="isEditing ? 'Edit Idea' : 'New Idea'" 
    modal 
    :style="{ width: '40rem' }"
    :breakpoints="{ '640px': '95vw' }"
  >
    <form @submit.prevent="save" class="flex flex-column gap-4">
      <!-- Title -->
      <div class="field">
        <label for="idea-title" class="block font-medium mb-2">
          Title <span class="text-red-500">*</span>
        </label>
        <InputText 
          id="idea-title"
          v-model="form.title" 
          :class="{ 'p-invalid': errors.title }"
          class="w-full"
          placeholder="Brief, descriptive title"
          @blur="validateField('title')"
        />
        <small v-if="errors.title" class="text-red-500 mt-1 block">
          <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.title }}
        </small>
      </div>

      <!-- Description -->
      <div class="field">
        <label for="idea-desc" class="block font-medium mb-2">
          Description <span class="text-red-500">*</span>
        </label>
        <Textarea 
          id="idea-desc"
          v-model="form.description" 
          :class="{ 'p-invalid': errors.description }"
          class="w-full"
          rows="4" 
          autoResize
          placeholder="Describe the idea..."
          @blur="validateField('description')"
        />
        <small v-if="errors.description" class="text-red-500 mt-1 block">
          <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.description }}
        </small>
      </div>

      <!-- Category & Status -->
      <div class="grid">
        <div class="col-12 md:col-6">
          <label for="idea-category" class="block font-medium mb-2">
            Category <span class="text-red-500">*</span>
          </label>
          <Dropdown 
            id="idea-category"
            v-model="form.category" 
            :options="categories"
            :class="{ 'p-invalid': errors.category }"
            class="w-full"
            placeholder="Select category"
            @change="validateField('category')"
          />
          <small v-if="errors.category" class="text-red-500 mt-1 block">
            <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.category }}
          </small>
        </div>
        <div class="col-12 md:col-6">
          <label for="idea-status" class="block font-medium mb-2">Status</label>
          <Dropdown 
            id="idea-status"
            v-model="form.status" 
            :options="statuses"
            class="w-full"
          />
        </div>
      </div>

      <!-- Tags -->
      <div class="field">
        <label for="idea-tags" class="block font-medium mb-2">Tags</label>
        <Chips 
          id="idea-tags"
          v-model="form.tags" 
          separator=","
          class="w-full"
          placeholder="Type and press Enter"
        />
        <small class="text-600 mt-1 block">Add keywords to help categorize this idea</small>
      </div>

      <!-- Actions -->
      <div class="flex justify-content-end gap-2 pt-3 border-top-1 surface-border">
        <Button 
          type="button"
          label="Cancel" 
          severity="secondary" 
          outlined
          @click="close"
        />
        <Button 
          type="submit"
          :label="isEditing ? 'Update' : 'Create'"
          :icon="isEditing ? 'pi pi-check' : 'pi pi-plus'"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Chips from 'primevue/chips'

const props = defineProps({ 
  modelValue: Boolean, 
  value: Object 
})

const emit = defineEmits(['update:modelValue', 'submit'])

import { CATEGORIES, STATUSES } from '../constants'

// Constants
const categories = CATEGORIES
const statuses = STATUSES

// Form state
const form = reactive({ 
  title: '', 
  description: '', 
  category: '', 
  status: 'New', 
  tags: [] 
})

const errors = reactive({
  title: '',
  description: '',
  category: ''
})

// Computed
const visible = computed({ 
  get: () => props.modelValue, 
  set: (v) => emit('update:modelValue', v)
})

const isEditing = computed(() => !!props.value?.id)

// Reset form when value prop changes
watch(() => props.value, (v) => { 
  if (v) {
    Object.assign(form, { 
      title: '',
      description: '',
      category: '',
      status: 'New',
      tags: [], 
      ...v 
    })
    // Clear errors when opening
    Object.keys(errors).forEach(k => errors[k] = '')
  }
}, { immediate: true })

// Validation
function validateField(field) {
  switch (field) {
    case 'title':
      errors.title = form.title?.trim() ? '' : 'Title is required'
      break
    case 'description':
      errors.description = form.description?.trim() ? '' : 'Description is required'
      break
    case 'category':
      errors.category = form.category ? '' : 'Category is required'
      break
  }
}

function validateAll() {
  validateField('title')
  validateField('description')
  validateField('category')
  return !errors.title && !errors.description && !errors.category
}

// Actions
function close() { 
  visible.value = false 
}

function save() { 
  if (!validateAll()) return
  emit('submit', { ...form })
  close() 
}
</script>

<style scoped>
.field {
  margin-bottom: 0;
}

:deep(.p-chips-input-token input) {
  width: 100%;
}
</style>
