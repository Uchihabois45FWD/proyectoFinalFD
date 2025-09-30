import React, { useEffect, useState } from 'react'
import { authService } from '../../services/AuthServices.jsx'
import { eventsService } from '../../services/EventsService.jsx'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../../styles/events/Events.css'

function Events() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isUser = authService.isUser()
  const [filters, setFilters] = useState({ q: '', from: '', to: '' })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await eventsService.list()
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Error cargando eventos:', e)
      setError('No se pudieron cargar los eventos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

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
      <h1>{isUser ? 'Eventos Aprobados' : 'Eventos'}</h1>
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
        <div className="events-loading">Cargando eventos...</div>
      ) : error ? (
        <div className="events-error">{error}</div>
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
                {isUser && <th className="events-th">Guardar</th>}
                <th className="events-th">Acciones</th>
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
                  {isUser && (
                    <td className="events-td">
                      <button
                        className="btn"
                        onClick={async () => {
                          const user = authService.getCurrentUser()
                          if (!user) return
                          try {
                            const isSaved = Array.isArray(user.savedEvents) && user.savedEvents.includes(ev.id)
                            if (isSaved) {
                              const next = { ...user, savedEvents: user.savedEvents.filter(x => x !== ev.id) }
                              await authService.updateUser(next)
                            } else {
                              const next = { ...user, savedEvents: [...(user.savedEvents || []), ev.id] }
                              await authService.updateUser(next)
                            }
                            // Reload to update
                            load()
                          } catch (e) {
                            alert('Error al actualizar eventos guardados')
                          }
                        }}
                      >
                        {Array.isArray(authService.getCurrentUser()?.savedEvents) && authService.getCurrentUser().savedEvents.includes(ev.id) ? 'Quitar' : 'Guardar'}
                      </button>
                    </td>
                  )}
                  <td className="events-td">
                    <Link to={`/Events/${ev.id}`}>Ver</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isUser && filteredRows.length > 0 && (
        <div className="events-map">
          <MapContainer center={[9.9281, -84.0907]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredRows.map(ev => (
              <Marker key={ev.id} position={ev.location?.coordinates || [9.9281, -84.0907]}>
                <Popup>{ev.title}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  )
}

export default Events
