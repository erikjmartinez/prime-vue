<template>
  <div class="surface-card p-3 border-round shadow-1">
    <h2 class="mt-0">Submit Idea (Complex Form)</h2>
    <p class="text-600">Intentionally complex for evaluation. Improve validation, a11y, and UX.</p>
    <div class="grid">
      <div class="col-12"><Panel header="Idea Basics"><div class="grid">
        <div class="col-12 md:col-6"><label class="block mb-2" for="title">Title</label><InputText id="title" v-model="form.title"/><small class="block text-red-500" v-if="errors.title">* {{ errors.title }}</small></div>
        <div class="col-12 md:col-6"><label class="block mb-2" for="category">Category</label><Dropdown id="category" v-model="form.category" :options="categories" placeholder="Category"/><small class="block text-red-500" v-if="errors.category">* {{ errors.category }}</small></div>
        <div class="col-12"><label class="block mb-2" for="desc">Description</label><Textarea id="desc" v-model="form.description" rows="4" autoResize/></div>
        <div class="col-12"><label class="block mb-2">Tags</label><Chips v-model="form.tags" separator=","/></div>
      </div></Panel></div>
      <div class="col-12"><Panel header="Impact & Priority"><div class="grid">
        <div class="col-12 md:col-6"><label class="block mb-2">Target Personas</label><MultiSelect v-model="form.personas" :options="personas" optionLabel="label" display="chip"/></div>
        <div class="col-12 md:col-3"><label class="block mb-2">Impact Score</label><Slider v-model="form.impact" :min="0" :max="10"/><div class="mt-1 text-600">Score: {{ form.impact }}</div></div>
        <div class="col-12 md:col-3"><label class="block mb-2">Expected Reach</label><InputNumber v-model="form.reach" :min="0" :step="100" mode="decimal"/></div>
        <div class="col-12 md:col-3"><label class="block mb-2">Target Date</label><Calendar v-model="form.targetDate" showIcon/></div>
      </div></Panel></div>
      <div class="col-12"><Panel header="Technical"><div class="grid">
        <div class="col-12 md:col-4"><label class="block mb-2">Complexity</label><Dropdown v-model="form.complexity" :options="['Low','Medium','High']"/></div>
        <div class="col-12 md:col-4"><label class="block mb-2">Dependencies</label><Chips v-model="form.dependencies"/></div>
        <div class="col-12 md:col-4"><label class="block mb-2" for="repo">Repository URL</label><InputText id="repo" v-model="form.repoUrl" placeholder="https://github.com/org/repo"/></div>
        <div class="col-12">
          <div class="flex gap-3 align-items-center">
            <div class="flex align-items-center gap-2"><RadioButton inputId="privacy1" name="privacy" value="public" v-model="form.privacy"/><label for="privacy1">Public</label></div>
            <div class="flex align-items-center gap-2"><RadioButton inputId="privacy2" name="privacy" value="internal" v-model="form.privacy"/><label for="privacy2">Internal</label></div>
          </div>
        </div>
      </div></Panel></div>
      <div class="col-12"><Panel header="Contact & Meta"><div class="grid">
        <div class="col-12 md:col-4"><label class="block mb-2" for="name">Requester Name</label><InputText id="name" v-model="form.requester.name"/></div>
        <div class="col-12 md:col-4"><label class="block mb-2" for="email">Requester Email</label><InputText id="email" v-model="form.requester.email" placeholder="name@example.com"/></div>
        <div class="col-12 md:col-4"><label class="block mb-2">Notify Me</label><InputSwitch v-model="form.notify"/></div>
        <div class="col-12"><div class="flex align-items-center gap-2"><Checkbox inputId="terms" v-model="form.terms" :binary="true"/><label for="terms">I confirm the information is accurate.</label></div><small class="block text-red-500" v-if="errors.terms">* {{ errors.terms }}</small></div>
      </div></Panel></div>
      <div class="col-12 flex justify-content-end gap-2"><Button label="Save Draft" icon="pi pi-save" severity="secondary" @click="saveDraft"/><Button label="Submit" icon="pi pi-check" @click="submit"/></div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import Panel from 'primevue/panel'; import InputText from 'primevue/inputtext'; import Textarea from 'primevue/textarea'; import Dropdown from 'primevue/dropdown'; import Chips from 'primevue/chips'; import MultiSelect from 'primevue/multiselect'; import Slider from 'primevue/slider'; import InputNumber from 'primevue/inputnumber'; import Calendar from 'primevue/calendar'; import RadioButton from 'primevue/radiobutton'; import Checkbox from 'primevue/checkbox'; import InputSwitch from 'primevue/inputswitch'; import Button from 'primevue/button'
const categories = ['Platform','UI','Performance','Integrations','Security']; const personas=[{label:'Admin'},{label:'Developer'},{label:'Analyst'},{label:'End User'}]
const form = reactive({ title:'', description:'', category:'', tags:[], personas:[], impact:5, reach:0, targetDate:null, complexity:'', dependencies:[], repoUrl:'', privacy:'internal', requester:{name:'',email:''}, notify:false, terms:false })
const errors = reactive({ title:'', category:'', terms:'' })
function validate(){ errors.title=form.title?'':'Title is required.'; errors.category=form.category?'':'Category is required.'; errors.terms=form.terms?'':'You must confirm accuracy.'; return !(errors.title||errors.category||errors.terms) }
function saveDraft(){ localStorage.setItem('draft_submit_idea', JSON.stringify(form)); alert('Draft saved to localStorage.') }
function submit(){ if(!validate()) return; alert('Submitted! (Hook this into the ideas store in your implementation.)') }
</script>
