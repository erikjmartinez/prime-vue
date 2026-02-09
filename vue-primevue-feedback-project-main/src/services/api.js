/**
 * Mock API for ideas using localStorage
 */
import seed from '../assets/ideas.json'
import { v4 as uuid } from 'uuid'

const LS_KEY = 'pv_ideas'

// Simulate network delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// localStorage helpers
function read() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

// Seed data on first load
if (!read()) {
  write(seed)
}

/**
 * Get all ideas
 */
export async function listIdeas() {
  await sleep(300)
  return read() || []
}

/**
 * Create a new idea
 */
export async function createIdea(payload) {
  await sleep(250)
  const ideas = read() || []
  const newIdea = {
    id: uuid(),
    votes: 0,
    createdAt: new Date().toISOString(),
    ...payload
  }
  ideas.unshift(newIdea)
  write(ideas)
  return newIdea
}

/**
 * Update an existing idea
 */
export async function updateIdea(id, patch) {
  await sleep(250)
  const ideas = read() || []
  const index = ideas.findIndex(x => x.id === id)
  if (index < 0) {
    throw new Error('Idea not found')
  }
  ideas[index] = { ...ideas[index], ...patch }
  write(ideas)
  return ideas[index]
}

/**
 * Delete an idea
 */
export async function deleteIdea(id) {
  await sleep(200)
  const ideas = read() || []
  write(ideas.filter(x => x.id !== id))
  return { id }
}

/**
 * Upvote an idea
 */
export async function upvote(id) {
  await sleep(150)
  const ideas = read() || []
  const index = ideas.findIndex(x => x.id === id)
  if (index < 0) {
    throw new Error('Idea not found')
  }
  ideas[index].votes = (ideas[index].votes || 0) + 1
  write(ideas)
  return { id, votes: ideas[index].votes }
}
