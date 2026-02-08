<template>
  <Dialog v-model:visible="visible" modal header="Idea" :style="{ width: '35rem' }">
    <div class="flex flex-column gap-3">
      <div class="field"><label class="block mb-2">Title</label><InputText v-model="form.title" /></div>
      <div class="field"><label class="block mb-2">Description</label><Textarea v-model="form.description" rows="4" autoResize /></div>
      <div class="grid">
        <div class="col-12 md:col-6"><label class="block mb-2">Category</label><Dropdown v-model="form.category" :options="categories" /></div>
        <div class="col-12 md:col-6"><label class="block mb-2">Status</label><Dropdown v-model="form.status" :options="statuses" /></div>
      </div>
      <div class="field"><label class="block mb-2">Tags</label><Chips v-model="form.tags" separator="," /></div>
      <div class="flex justify-content-end gap-2 mt-3"><Button label="Cancel" severity="secondary" @click="close"/><Button label="Save" @click="save"/></div>
    </div>
  </Dialog>
</template>
<script setup>
import { reactive, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'; import InputText from 'primevue/inputtext'; import Textarea from 'primevue/textarea'; import Button from 'primevue/button'; import Dropdown from 'primevue/dropdown'; import Chips from 'primevue/chips'
const props = defineProps({ modelValue:Boolean, value:Object }); const emit = defineEmits(['update:modelValue','submit'])
const categories=['Platform','UI','Performance','Integrations','Security']; const statuses=['New','Planned','In Progress','Done']
const form = reactive({ title:'', description:'', category:'', status:'New', tags:[] })
watch(()=>props.value,(v)=>{ if(v) Object.assign(form, { title:'',description:'',category:'',status:'New',tags:[], ...v }) }, {immediate:true})
const visible = computed({ get:()=>props.modelValue, set:(v)=>emit('update:modelValue', v)})
function close(){ visible.value=false }
function save(){ if(!form.title||!form.category) return alert('Title & Category required'); emit('submit', {...form}); close() }
</script>
