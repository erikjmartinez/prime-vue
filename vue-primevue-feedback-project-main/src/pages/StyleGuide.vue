<template>
  <div class="style-guide">
    <!-- Header -->
    <div class="mb-5">
      <h1 class="mt-0 mb-2 text-3xl">Style Guide</h1>
      <p class="text-600 mt-0">Visual system and component reference for the Ideas application.</p>
    </div>

    <!-- Theme Section -->
    <section class="mb-5">
      <h2 class="mt-0 mb-3 text-xl flex align-items-center gap-2">
        <i class="pi pi-palette"></i>
        Theme
      </h2>
      <div class="surface-card p-4 border-round shadow-1">
        <div class="flex align-items-center justify-content-between">
          <div>
            <h3 class="mt-0 mb-2">Current Theme: {{ isDark ? 'Dark Mode' : 'Light Mode' }}</h3>
            <p class="text-600 mb-0">Toggle between light and dark themes using the button in the header or below.</p>
          </div>
          <Button 
            :label="isDark ? 'Switch to Light' : 'Switch to Dark'"
            :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            @click="toggleTheme"
          />
        </div>
      </div>
    </section>

    <!-- Color Palette -->
    <section class="mb-5">
      <h2 class="mt-0 mb-3 text-xl flex align-items-center gap-2">
        <i class="pi pi-stop-circle"></i>
        Color Palette
      </h2>
      <div class="surface-card p-4 border-round shadow-1">
        <!-- Primary Colors -->
        <h3 class="mt-0 mb-3">Primary</h3>
        <div class="flex flex-wrap gap-3 mb-4">
          <div v-for="shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]" :key="shade" class="text-center">
            <div 
              :class="`bg-primary-${shade}`" 
              class="border-round" 
              style="width: 4rem; height: 4rem"
            ></div>
            <small class="text-600 block mt-1">{{ shade }}</small>
          </div>
        </div>

        <!-- Status Colors -->
        <h3 class="mt-0 mb-3">Status Colors</h3>
        <div class="grid">
          <div class="col-6 md:col-3">
            <div class="p-3 border-round bg-gray-100 text-center">
              <div class="font-bold text-gray-600 mb-1">New</div>
              <small class="text-600">Secondary / Gray</small>
            </div>
          </div>
          <div class="col-6 md:col-3">
            <div class="p-3 border-round bg-blue-100 text-center">
              <div class="font-bold text-blue-500 mb-1">Planned</div>
              <small class="text-600">Info / Blue</small>
            </div>
          </div>
          <div class="col-6 md:col-3">
            <div class="p-3 border-round text-center" style="background: rgba(251, 192, 45, 0.2)">
              <div class="font-bold mb-1" style="color: #FBC02D">In Progress</div>
              <small class="text-600">Warning / Yellow</small>
            </div>
          </div>
          <div class="col-6 md:col-3">
            <div class="p-3 border-round bg-green-100 text-center">
              <div class="font-bold text-green-500 mb-1">Done</div>
              <small class="text-600">Success / Green</small>
            </div>
          </div>
        </div>

        <!-- Semantic Colors -->
        <h3 class="mt-3 mb-3">Semantic</h3>
        <div class="flex flex-wrap gap-3">
          <Tag value="Success" severity="success" />
          <Tag value="Info" severity="info" />
          <Tag value="Warning" severity="warning" />
          <Tag value="Danger" severity="danger" />
          <Tag value="Secondary" severity="secondary" />
        </div>
      </div>
    </section>

    <!-- Typography -->
    <section class="mb-5">
      <h2 class="mt-0 mb-3 text-xl flex align-items-center gap-2">
        <i class="pi pi-align-left"></i>
        Typography
      </h2>
      <div class="surface-card p-4 border-round shadow-1">
        <div class="grid">
          <div class="col-12 md:col-6">
            <h3 class="mt-0 mb-3">Headings</h3>
            <h1 class="mt-0 mb-2">Heading 1 (text-3xl)</h1>
            <h2 class="mt-0 mb-2">Heading 2 (text-2xl)</h2>
            <h3 class="mt-0 mb-2">Heading 3 (text-xl)</h3>
            <h4 class="mt-0 mb-2">Heading 4 (text-lg)</h4>
            <h5 class="mt-0 mb-2">Heading 5 (text-base)</h5>
            <h6 class="mt-0 mb-0">Heading 6 (text-sm)</h6>
          </div>
          <div class="col-12 md:col-6">
            <h3 class="mt-0 mb-3">Body Text</h3>
            <p class="mb-2">Regular paragraph text with <strong>bold</strong> and <em>italic</em> styles.</p>
            <p class="text-600 mb-2">Secondary text (text-600) for descriptions and helper text.</p>
            <p class="text-500 mb-2">Muted text (text-500) for less important content.</p>
            <p class="text-primary mb-2">Primary colored text for emphasis.</p>
            <p class="text-sm text-600 mb-0">Small text (text-sm) for captions and metadata.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Buttons -->
    <section class="mb-5">
      <h2 class="mt-0 mb-3 text-xl flex align-items-center gap-2">
        <i class="pi pi-bolt"></i>
        Buttons
      </h2>
      <div class="surface-card p-4 border-round shadow-1">
        <!-- Severities -->
        <h3 class="mt-0 mb-3">Severities</h3>
        <div class="flex flex-wrap gap-2 mb-4">
          <Button label="Primary" />
          <Button label="Secondary" severity="secondary" />
          <Button label="Success" severity="success" />
          <Button label="Info" severity="info" />
          <Button label="Warning" severity="warning" />
          <Button label="Danger" severity="danger" />
          <Button label="Help" severity="help" />
        </div>

        <!-- Variants -->
        <h3 class="mt-0 mb-3">Variants</h3>
        <div class="flex flex-wrap gap-2 mb-4">
          <Button label="Solid" />
          <Button label="Outlined" outlined />
          <Button label="Text" text />
          <Button label="Raised" raised />
          <Button icon="pi pi-check" rounded aria-label="Rounded" />
          <Button icon="pi pi-bookmark" rounded outlined aria-label="Rounded Outlined" />
          <Button icon="pi pi-search" rounded text aria-label="Rounded Text" />
        </div>

        <!-- With Icons -->
        <h3 class="mt-0 mb-3">With Icons</h3>
        <div class="flex flex-wrap gap-2 mb-4">
          <Button label="Save" icon="pi pi-save" />
          <Button label="Delete" icon="pi pi-trash" severity="danger" />
          <Button label="Next" icon="pi pi-arrow-right" iconPos="right" />
          <Button icon="pi pi-plus" label="Add" severity="success" />
        </div>

        <!-- States -->
        <h3 class="mt-0 mb-3">States</h3>
        <div class="flex flex-wrap gap-2">
          <Button label="Normal" />
          <Button label="Disabled" disabled />
          <Button label="Loading" loading />
        </div>
      </div>
    </section>

    <!-- Form Inputs -->
    <section class="mb-5">
      <h2 class="mt-0 mb-3 text-xl flex align-items-center gap-2">
        <i class="pi pi-pencil"></i>
        Form Inputs
      </h2>
      <div class="surface-card p-4 border-round shadow-1">
        <div class="grid">
          <!-- Text Input -->
          <div class="col-12 md:col-4">
            <label class="block font-medium mb-2">InputText</label>
            <InputText v-model="demoText" placeholder="Enter text..." class="w-full" />
          </div>

          <!-- Textarea -->
          <div class="col-12 md:col-4">
            <label class="block font-medium mb-2">Textarea</label>
            <Textarea v-model="demoTextarea" placeholder="Enter description..." rows="1" autoResize class="w-full" />
          </div>

          <!-- Number -->
          <div class="col-12 md:col-4">
            <label class="block font-medium mb-2">InputNumber</label>
            <InputNumber v-model="demoNumber" class="w-full" />
          </div>

          <!-- Dropdown -->
          <div class="col-12 md:col-4">
            <label class="block font-medium mb-2">Dropdown</label>
            <Dropdown v-model="demoDropdown" :options="dropdownOptions" placeholder="Select..." class="w-full" />
          </div>

          <!-- MultiSelect -->
          <div class="col-12 md:col-4">
            <label class="block font-medium mb-2">MultiSelect</label>
            <MultiSelect v-model="demoMulti" :options="dropdownOptions" placeholder="Select..." class="w-full" />
          </div>

          <!-- Chips -->
          <div class="col-12 md:col-4">
            <label class="block font-medium mb-2">Chips</label>
            <Chips v-model="demoChips" placeholder="Add tags..." class="w-full" />
          </div>

          <!-- Calendar -->
          <div class="col-12 md:col-4">
            <label class="block font-medium mb-2">Calendar</label>
            <Calendar v-model="demoDate" showIcon class="w-full" />
          </div>

          <!-- Slider -->
          <div class="col-12 md:col-4">
            <label class="block font-medium mb-2">Slider: {{ demoSlider }}</label>
            <Slider v-model="demoSlider" class="w-full mt-3" />
          </div>

          <!-- Switch -->
          <div class="col-12 md:col-4">
            <label class="block font-medium mb-2">InputSwitch</label>
            <div class="flex align-items-center gap-2">
              <InputSwitch v-model="demoSwitch" />
              <span>{{ demoSwitch ? 'On' : 'Off' }}</span>
            </div>
          </div>

          <!-- Checkbox -->
          <div class="col-12 md:col-4">
            <label class="block font-medium mb-2">Checkbox</label>
            <div class="flex align-items-center gap-2">
              <Checkbox v-model="demoCheckbox" :binary="true" inputId="demo-checkbox" />
              <label for="demo-checkbox">I agree to terms</label>
            </div>
          </div>

          <!-- Radio Buttons -->
          <div class="col-12 md:col-4">
            <label class="block font-medium mb-2">RadioButton</label>
            <div class="flex gap-3">
              <div class="flex align-items-center gap-1">
                <RadioButton v-model="demoRadio" value="A" inputId="radio-a" />
                <label for="radio-a">A</label>
              </div>
              <div class="flex align-items-center gap-1">
                <RadioButton v-model="demoRadio" value="B" inputId="radio-b" />
                <label for="radio-b">B</label>
              </div>
            </div>
          </div>

          <!-- Invalid State -->
          <div class="col-12 md:col-4">
            <label class="block font-medium mb-2">Invalid State</label>
            <InputText placeholder="Invalid input" class="w-full p-invalid" />
            <small class="text-red-500 mt-1 block">This field is required</small>
          </div>
        </div>
      </div>
    </section>

    <!-- Data Display -->
    <section class="mb-5">
      <h2 class="mt-0 mb-3 text-xl flex align-items-center gap-2">
        <i class="pi pi-table"></i>
        Data Display
      </h2>
      <div class="surface-card p-4 border-round shadow-1">
        <!-- Tags -->
        <h3 class="mt-0 mb-3">Tags</h3>
        <div class="flex flex-wrap gap-2 mb-4">
          <Tag value="Default" />
          <Tag value="Primary" severity="primary" />
          <Tag value="Success" severity="success" />
          <Tag value="Info" severity="info" />
          <Tag value="Warning" severity="warning" />
          <Tag value="Danger" severity="danger" />
          <Tag value="Secondary" severity="secondary" />
          <Tag value="With Icon" icon="pi pi-user" />
          <Tag value="Rounded" rounded />
        </div>

        <!-- Badges -->
        <h3 class="mt-0 mb-3">Badges</h3>
        <div class="flex flex-wrap gap-4 mb-4">
          <i class="pi pi-bell p-overlay-badge" style="font-size: 1.5rem">
            <Badge value="2" />
          </i>
          <i class="pi pi-calendar p-overlay-badge" style="font-size: 1.5rem">
            <Badge value="5" severity="danger" />
          </i>
          <Button label="Messages" badge="8" />
          <Button label="Updates" badge="2" badgeSeverity="warning" outlined />
        </div>

        <!-- Progress -->
        <h3 class="mt-0 mb-3">ProgressBar</h3>
        <div class="mb-4">
          <ProgressBar :value="65" class="mb-2" />
          <ProgressBar :value="40" :showValue="false" style="height: 6px" />
        </div>

        <!-- Skeleton -->
        <h3 class="mt-0 mb-3">Skeleton</h3>
        <div class="flex gap-3">
          <Skeleton width="10rem" height="1rem" />
          <Skeleton shape="circle" size="3rem" />
          <Skeleton width="5rem" height="2rem" borderRadius="1rem" />
        </div>
      </div>
    </section>

    <!-- Feedback -->
    <section class="mb-5">
      <h2 class="mt-0 mb-3 text-xl flex align-items-center gap-2">
        <i class="pi pi-bell"></i>
        Feedback
      </h2>
      <div class="surface-card p-4 border-round shadow-1">
        <!-- Messages -->
        <h3 class="mt-0 mb-3">Messages</h3>
        <div class="flex flex-column gap-2 mb-4">
          <Message severity="success" :closable="false">Success message</Message>
          <Message severity="info" :closable="false">Info message</Message>
          <Message severity="warn" :closable="false">Warning message</Message>
          <Message severity="error" :closable="false">Error message</Message>
        </div>

        <!-- Toast Demo -->
        <h3 class="mt-0 mb-3">Toast</h3>
        <div class="flex flex-wrap gap-2">
          <Button label="Success" severity="success" @click="showToast('success')" />
          <Button label="Info" severity="info" @click="showToast('info')" />
          <Button label="Warn" severity="warning" @click="showToast('warn')" />
          <Button label="Error" severity="danger" @click="showToast('error')" />
        </div>
      </div>
    </section>

    <!-- Spacing Reference -->
    <section class="mb-5">
      <h2 class="mt-0 mb-3 text-xl flex align-items-center gap-2">
        <i class="pi pi-arrows-alt"></i>
        Spacing
      </h2>
      <div class="surface-card p-4 border-round shadow-1">
        <p class="text-600 mb-3">PrimeFlex spacing utilities: p-{size}, m-{size}, gap-{size}</p>
        <div class="flex flex-wrap gap-3">
          <div v-for="size in [1, 2, 3, 4, 5, 6]" :key="size" class="text-center">
            <div :class="`p-${size} bg-primary-100 border-round`">
              <div class="bg-primary border-round" style="width: 2rem; height: 2rem"></div>
            </div>
            <small class="text-600 block mt-1">p-{{ size }}</small>
          </div>
        </div>
      </div>
    </section>

    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useTheme } from '../composables/useTheme'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import Chips from 'primevue/chips'
import Calendar from 'primevue/calendar'
import Slider from 'primevue/slider'
import InputSwitch from 'primevue/inputswitch'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import ProgressBar from 'primevue/progressbar'
import Skeleton from 'primevue/skeleton'
import Message from 'primevue/message'
import Toast from 'primevue/toast'

const toast = useToast()
const { isDark, toggleTheme } = useTheme()

// Demo form state
const demoText = ref('')
const demoTextarea = ref('')
const demoNumber = ref(42)
const demoDropdown = ref(null)
const demoMulti = ref([])
const demoChips = ref(['Vue', 'PrimeVue'])
const demoDate = ref(null)
const demoSlider = ref(50)
const demoSwitch = ref(true)
const demoCheckbox = ref(false)
const demoRadio = ref('A')

const dropdownOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4']

function showToast(severity) {
  const messages = {
    success: { summary: 'Success', detail: 'Operation completed successfully' },
    info: { summary: 'Info', detail: 'Here is some information' },
    warn: { summary: 'Warning', detail: 'Please review this carefully' },
    error: { summary: 'Error', detail: 'Something went wrong' }
  }
  toast.add({ severity, ...messages[severity], life: 3000 })
}
</script>

<style scoped>
.style-guide section {
  scroll-margin-top: 5rem;
}

:deep(.p-chips-input-token input) {
  width: 100%;
}
</style>
