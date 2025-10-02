import axios from 'axios'

const API_URL = 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

export const eventsService = {
  async list() {
    const res = await api.get('/events')
    return Array.isArray(res.data) ? res.data : []
  },
  async getById(id) {
    const res = await api.get(`/events/${id}`)
    return res.data
  },
  async create(payload) {
    const res = await api.post('/events', payload)
    return res.data
  },
  async update(id, payload) {
    try {
      const res = await api.put(`/events/${id}`, payload)
      return res.data
    } catch (err) {
      const resList = await api.get('/events', { params: { id: id } })
      if (Array.isArray(resList.data) && resList.data.length > 0) {
        const existing = resList.data[0]
        const res = await api.put(`/events/${existing.id}`, { ...existing, ...payload })
        return res.data
      }
      throw err
    }
  },
  async delete(id) {
    try {
      await api.delete(`/events/${id}`)
      return true
    } catch (err) {
      const resList = await api.get('/events', { params: { id } })
      if (Array.isArray(resList.data) && resList.data.length > 0) {
        const existing = resList.data[0]
        await api.delete(`/events/${existing.id}`)
        return true
      }
      throw err
    }
  },
  async updateStatus(id, status) {
    let current = null
    try {
      current = await this.getById(id)
    } catch (e) {
      const byQuery = await api.get('/events', { params: { id: id } })
      if (Array.isArray(byQuery.data) && byQuery.data.length > 0) {
        current = byQuery.data[0]
      }
    }
    if (!current) {
      throw new Error(`No se encontró el evento con id ${id} para actualizar`)
    }
    const res = await api.put(`/events/${id}`, { ...current, status })
    return res.data
  }
}

