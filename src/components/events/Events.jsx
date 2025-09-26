import React, { useEffect, useState } from 'react'
import { authService } from '../../services/AuthServices.jsx'
import { eventsService } from '../../services/EventsService.jsx'
import '../../styles/events/Events.css'

function Events() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const isUser = authService.isUser()
  const [filters, setFilters] = useState({ q: '', from: '', to: '' })

  const load = async () => {
    setLoading(true)
    try {
      const data = await eventsService.list()
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Error cargando eventos:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // La creación de eventos ahora está disponible sólo en la página de Colaboradores (/Colab)

  const onFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const applyFilters = (list) => {
    let result = Array.isArray(list) ? list : []
    // Users: solo eventos aprobados
    if (isUser) {
      result = result.filter(ev => (ev.status || 'pending') === 'approved')
    }
    // Búsqueda por título
    if (filters.q) {
      const q = filters.q.toLowerCase()
      result = result.filter(ev => (ev.title || '').toLowerCase().includes(q))
    }
    // Filtro por rango de fechas
    if (filters.from) {
      const fromTs = new Date(filters.from).getTime()
      result = result.filter(ev => ev.date && new Date(ev.date).getTime() >= fromTs)
    }
    if (filters.to) {
      const toTs = new Date(filters.to).getTime()
      result = result.filter(ev => ev.date && new Date(ev.date).getTime() <= toTs)
    }
    return result
  }

  const filteredRows = applyFilters(rows)

  return (
    <div className="events-page">
      <h1>Eventos</h1>
      {isUser && (
        <div className="events-filters">
          <input
            name="q"
            value={filters.q}
            onChange={onFilterChange}
            placeholder="Buscar por título"
            className="events-input"
          />
          <label className="events-filter-label">Desde</label>
          <input
            type="datetime-local"
            name="from"
            value={filters.from}
            onChange={onFilterChange}
            className="events-input"
          />
          <label className="events-filter-label">Hasta</label>
          <input
            type="datetime-local"
            name="to"
            value={filters.to}
            onChange={onFilterChange}
            className="events-input"
          />
        </div>
      )}

      <h2>Listado</h2>
      {loading ? (
        <div>Cargando eventos...</div>
      ) : (
        <div className="events-table-wrapper">
          <table className="events-table">
            <thead>
              <tr>
                <th className="events-th">ID</th>
                <th className="events-th">Título</th>
                <th className="events-th">Fecha</th>
                <th className="events-th">Solicitante</th>
                <th className="events-th">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(ev => (
                <tr key={ev.id}>
                  <td className="events-td">{ev.id}</td>
                  <td className="events-td">{ev.title}</td>
                  <td className="events-td">{ev.date ? new Date(ev.date).toLocaleString() : '-'}</td>
                  <td className="events-td">{ev.requester}</td>
                  <td className="events-td">{ev.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Events
