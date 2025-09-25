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
    const numericId = Number(id)
    try {
      const res = await api.put(`/events/${numericId}`, payload)
      return res.data
    } catch (err) {
      // Intento alterno por si el recurso no existe con ese id numérico
      // o si el servidor requiere otro tipo de id
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
    const numericId = Number(id)
    try {
      await api.delete(`/events/${numericId}`)
      return true
    } catch (err) {
      // Fallback por si el id no es numérico en la base json
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
    const numericId = Number(id)
    try {
      const res = await api.patch(`/events/${numericId}` , { status })
      return res.data
    } catch (err) {
      // Fallback: si PATCH no está disponible o el item no se encuentra en memoria,
      // intentamos hacer PUT con el objeto completo.
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        let current = null
        try {
          current = await this.getById(numericId)
        } catch (e) {
          // Ignorar, probaremos por query
        }
        if (!current) {
          const byQuery = await api.get('/events', { params: { id: numericId } })
          if (Array.isArray(byQuery.data) && byQuery.data.length > 0) {
            current = byQuery.data[0]
          }
        }
        if (!current) {
          const notFound = new Error(`No se encontró el evento con id ${numericId} para actualizar`)
          notFound.cause = err
          throw notFound
        }
        const res = await api.put(`/events/${numericId}`, { ...current, status })
        return res.data
      }
      throw err
    }
  }
}
