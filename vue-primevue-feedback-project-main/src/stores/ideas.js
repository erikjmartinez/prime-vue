import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { listIdeas, createIdea, updateIdea, deleteIdea, upvote } from '../services/api'

export const useIdeasStore = defineStore('ideas', () => {
  const items = ref([]); const loading = ref(false); const error = ref(null)
  async function refresh(){ loading.value=true; error.value=null; try{ items.value = await listIdeas() } catch(e){ error.value=e?.message||'Failed to load ideas'} finally { loading.value=false } }
  async function add(p){ await createIdea(p); await refresh() }
  async function patch(id,p){ await updateIdea(id,p); await refresh() }
  async function remove(id){ await deleteIdea(id); await refresh() }
  async function upvoteIdea(id){ await upvote(id); const it=items.value.find(i=>i.id===id); if(it) it.votes=(it.votes||0)+1 }
  const stats = computed(() => {
    const byStatus = items.value.reduce((acc, idea) => {
      acc[idea.status] = (acc[idea.status] || 0) + 1
      return acc
    }, {})
    
    const total = items.value.length
    
    const mostVoted = items.value.slice().sort((a, b) => (b.votes || 0) - (a.votes || 0))[0] || null
    
    // New this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const newThisMonth = items.value.filter(i => {
      const created = new Date(i.createdAt)
      return created >= startOfMonth
    }).length
    
    // Total votes
    const totalVotes = items.value.reduce((sum, i) => sum + (i.votes || 0), 0)
    
    return { total, byStatus, mostVoted, newThisMonth, totalVotes }
  })
  return { items, loading, error, refresh, add, patch, remove, upvoteIdea, stats }
})
