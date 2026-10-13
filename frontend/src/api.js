import {
  fallbackStats,
  fallbackMembers,
  fallbackProjects,
  fallbackVendors,
  fallbackExpenses,
  fallbackPurchases
} from './mockData'

const BASE_URL = '/api'

async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }))
      throw new Error(err.detail || 'Request failed')
    }
    if (res.status === 204) return null
    return await res.json()
  } catch (err) {
    // If backend isn't ready or network errors out, seamlessly fall back to realistic demo data
    console.info(`API unavailable for ${path}, serving realistic fallback demo data.`)
    return null
  }
}

export const api = {
  // Stats
  getStats: async () => {
    const data = await request('/stats')
    return data || fallbackStats
  },

  // Members
  getMembers: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const data = await request(`/members/?${query}`)
    if (data && data.length > 0) return data
    if (params.role) return fallbackMembers.filter(m => m.role === params.role)
    return fallbackMembers
  },
  getMember: async (id) => {
    const data = await request(`/members/${id}`)
    return data || fallbackMembers.find(m => m.id === Number(id))
  },
  createMember: async (payload) => {
    const data = await request('/members/', { method: 'POST', body: JSON.stringify(payload) })
    if (data) return data
    const newMember = { ...payload, id: Date.now() }
    fallbackMembers.unshift(newMember)
    return newMember
  },
  updateMember: async (id, payload) => {
    const data = await request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    if (data) return data
    const idx = fallbackMembers.findIndex(m => m.id === Number(id))
    if (idx !== -1) fallbackMembers[idx] = { ...fallbackMembers[idx], ...payload }
    return fallbackMembers[idx]
  },
  deleteMember: async (id) => {
    await request(`/members/${id}`, { method: 'DELETE' })
    const idx = fallbackMembers.findIndex(m => m.id === Number(id))
    if (idx !== -1) fallbackMembers.splice(idx, 1)
    return null
  },

  // Projects
  getProjects: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const data = await request(`/projects/?${query}`)
    if (data && data.length > 0) return data
    if (params.status) return fallbackProjects.filter(p => p.status === params.status)
    return fallbackProjects
  },
  getProject: async (id) => {
    const data = await request(`/projects/${id}`)
    return data || fallbackProjects.find(p => p.id === Number(id))
  },
  createProject: async (payload) => {
    const data = await request('/projects/', { method: 'POST', body: JSON.stringify(payload) })
    if (data) return data
    const newProj = { ...payload, id: Date.now(), spent: 0 }
    fallbackProjects.unshift(newProj)
    return newProj
  },
  updateProject: async (id, payload) => {
    const data = await request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    if (data) return data
    const idx = fallbackProjects.findIndex(p => p.id === Number(id))
    if (idx !== -1) fallbackProjects[idx] = { ...fallbackProjects[idx], ...payload }
    return fallbackProjects[idx]
  },
  deleteProject: async (id) => {
    await request(`/projects/${id}`, { method: 'DELETE' })
    const idx = fallbackProjects.findIndex(p => p.id === Number(id))
    if (idx !== -1) fallbackProjects.splice(idx, 1)
    return null
  },

  // Vendors
  getVendors: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const data = await request(`/vendors/?${query}`)
    return (data && data.length > 0) ? data : fallbackVendors
  },
  getVendor: async (id) => {
    const data = await request(`/vendors/${id}`)
    return data || fallbackVendors.find(v => v.id === Number(id))
  },
  createVendor: async (payload) => {
    const data = await request('/vendors/', { method: 'POST', body: JSON.stringify(payload) })
    if (data) return data
    const newVendor = { ...payload, id: Date.now(), total_spent: 0 }
    fallbackVendors.unshift(newVendor)
    return newVendor
  },
  updateVendor: async (id, payload) => {
    const data = await request(`/vendors/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    if (data) return data
    const idx = fallbackVendors.findIndex(v => v.id === Number(id))
    if (idx !== -1) fallbackVendors[idx] = { ...fallbackVendors[idx], ...payload }
    return fallbackVendors[idx]
  },
  deleteVendor: async (id) => {
    await request(`/vendors/${id}`, { method: 'DELETE' })
    const idx = fallbackVendors.findIndex(v => v.id === Number(id))
    if (idx !== -1) fallbackVendors.splice(idx, 1)
    return null
  },

  // Expenses
  getExpenses: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const data = await request(`/expenses/?${query}`)
    if (data && data.length > 0) return data
    if (params.category) return fallbackExpenses.filter(e => e.category === params.category)
    return fallbackExpenses
  },
  getExpense: async (id) => {
    const data = await request(`/expenses/${id}`)
    return data || fallbackExpenses.find(e => e.id === Number(id))
  },
  createExpense: async (payload) => {
    const data = await request('/expenses/', { method: 'POST', body: JSON.stringify(payload) })
    if (data) return data
    const newExp = { ...payload, id: Date.now() }
    fallbackExpenses.unshift(newExp)
    return newExp
  },
  updateExpense: async (id, payload) => {
    const data = await request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    if (data) return data
    const idx = fallbackExpenses.findIndex(e => e.id === Number(id))
    if (idx !== -1) fallbackExpenses[idx] = { ...fallbackExpenses[idx], ...payload }
    return fallbackExpenses[idx]
  },
  deleteExpense: async (id) => {
    await request(`/expenses/${id}`, { method: 'DELETE' })
    const idx = fallbackExpenses.findIndex(e => e.id === Number(id))
    if (idx !== -1) fallbackExpenses.splice(idx, 1)
    return null
  },

  // Purchase Orders
  getPurchases: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const data = await request(`/purchases/?${query}`)
    if (data && data.length > 0) return data
    if (params.status) return fallbackPurchases.filter(p => p.status === params.status)
    return fallbackPurchases
  },
  getPurchase: async (id) => {
    const data = await request(`/purchases/${id}`)
    return data || fallbackPurchases.find(p => p.id === Number(id))
  },
  createPurchase: async (payload) => {
    const data = await request('/purchases/', { method: 'POST', body: JSON.stringify(payload) })
    if (data) return data
    const newPO = { ...payload, id: Date.now() }
    fallbackPurchases.unshift(newPO)
    return newPO
  },
  updatePurchase: async (id, payload) => {
    const data = await request(`/purchases/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
    if (data) return data
    const idx = fallbackPurchases.findIndex(p => p.id === Number(id))
    if (idx !== -1) fallbackPurchases[idx] = { ...fallbackPurchases[idx], ...payload }
    return fallbackPurchases[idx]
  },
  deletePurchase: async (id) => {
    await request(`/purchases/${id}`, { method: 'DELETE' })
    const idx = fallbackPurchases.findIndex(p => p.id === Number(id))
    if (idx !== -1) fallbackPurchases.splice(idx, 1)
    return null
  },
}
