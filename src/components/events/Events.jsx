/**
 * Componente principal para la gestión y visualización de eventos.
 * Permite a los usuarios y administradores ver, filtrar y gestionar eventos.
 * Incluye una tabla de eventos, filtros avanzados y un mapa interactivo para usuarios.
 */
import React, { useEffect, useState } from 'react'
import { authService } from '../../services/AuthServices.jsx'
import { eventsService } from '../../services/EventsService.jsx'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../../styles/events/Events.css'

function Events() {
  // Estado para almacenar la lista de eventos cargados
  const [rows, setRows] = useState([])
  // Estado para indicar si se están cargando los datos
  const [loading, setLoading] = useState(true)
  // Estado para manejar errores durante la carga
  const [error, setError] = useState(null)
  // Determina si el usuario actual es un usuario regular (no admin/colaborador)
  const isUser = authService.isUser()
  // Estado para los filtros de búsqueda aplicados a los eventos
  const [filters, setFilters] = useState({
    q: '', // Búsqueda por palabra clave
    from: '', // Fecha desde
    to: '', // Fecha hasta
    location: '', // Ubicación (provincia/ciudad)
    game: '', // Juego/categoría
    type: '', // Tipo/formato
    priceMin: '', // Precio mínimo
    priceMax: '', // Precio máximo
    modality: '', // Modalidad
    organizer: '' // Organizador
  })

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

  const clearFilters = () => {
    setFilters({
      q: '',
      from: '',
      to: '',
      location: '',
      game: '',
      type: '',
      priceMin: '',
      priceMax: '',
      modality: '',
      organizer: ''
    })
  }

  const applyFilters = (list) => {
    let result = Array.isArray(list) ? list : []

    // Users: solo eventos aprobados
    if (isUser) {
      result = result.filter(ev => (ev.status || 'pending') === 'approved')
    }

    // Búsqueda por palabra clave (título, descripción, categoría)
    if (filters.q) {
      const q = filters.q.toLowerCase()
      result = result.filter(ev =>
        (ev.title || '').toLowerCase().includes(q) ||
        (ev.description || '').toLowerCase().includes(q) ||
        (ev.category || '').toLowerCase().includes(q)
      )
    }

    // Filtro por rango de fechas
    if (filters.from) {
      const fromTs = new Date(filters.from).getTime()
      result = result.filter(ev => {
        const eventDate = ev.date || ev.startDate
        return eventDate && new Date(eventDate).getTime() >= fromTs
      })
    }
    if (filters.to) {
      const toTs = new Date(filters.to).getTime()
      result = result.filter(ev => {
        const eventDate = ev.date || ev.startDate
        return eventDate && new Date(eventDate).getTime() <= toTs
      })
    }

    // Filtro por ubicación (provincia/ciudad)
    if (filters.location) {
      const location = filters.location.toLowerCase()
      result = result.filter(ev =>
        (ev.location?.address || '').toLowerCase().includes(location)
      )
    }

    // Filtro por juego/categoría
    if (filters.game) {
      const game = filters.game.toLowerCase()
      result = result.filter(ev =>
        (ev.category || '').toLowerCase().includes(game)
      )
    }

    // Filtro por tipo/formato
    if (filters.type) {
      const type = filters.type.toLowerCase()
      result = result.filter(ev =>
        (ev.format || '').toLowerCase().includes(type) ||
        (ev.category || '').toLowerCase().includes(type)
      )
    }

    // Filtro por precio
    if (filters.priceMin) {
      const minPrice = parseFloat(filters.priceMin)
      result = result.filter(ev => {
        const price = parseFloat(ev.price) || 0
        return price >= minPrice
      })
    }
    if (filters.priceMax) {
      const maxPrice = parseFloat(filters.priceMax)
      result = result.filter(ev => {
        const price = parseFloat(ev.price) || 0
        return price <= maxPrice
      })
    }

    // Filtro por modalidad
    if (filters.modality) {
      const modality = filters.modality.toLowerCase()
      result = result.filter(ev =>
        (ev.modality || '').toLowerCase().includes(modality)
      )
    }

    // Filtro por organizador
    if (filters.organizer) {
      const organizer = filters.organizer.toLowerCase()
      result = result.filter(ev =>
        (ev.requester || '').toLowerCase().includes(organizer)
      )
    }

    return result
  }

  const filteredRows = applyFilters(rows)

  return (
    <div className="events-page">
      <h1>{isUser ? 'Eventos Aprobados' : 'Eventos'}</h1>
      {isUser && (
        <div className="events-filters">
          <div className="filters-header">
            <h3>Filtros de Búsqueda</h3>
            <button onClick={clearFilters} className="btn btn--secondary">Limpiar Filtros</button>
          </div>

          <div className="filters-grid">
            {/* Búsqueda por palabra clave */}
            <div className="filter-group">
              <label className="filter-label">Buscar</label>
              <input
                name="q"
                value={filters.q}
                onChange={onFilterChange}
                placeholder="Título, descripción o categoría"
                className="events-input"
              />
            </div>

            {/* Fechas */}
            <div className="filter-group">
              <label className="filter-label">Fecha Desde</label>
              <input
                type="datetime-local"
                name="from"
                value={filters.from}
                onChange={onFilterChange}
                className="events-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Fecha Hasta</label>
              <input
                type="datetime-local"
                name="to"
                value={filters.to}
                onChange={onFilterChange}
                className="events-input"
              />
            </div>

            {/* Ubicación */}
            <div className="filter-group">
              <label className="filter-label">Ubicación</label>
              <input
                name="location"
                value={filters.location}
                onChange={onFilterChange}
                placeholder="Provincia o ciudad"
                className="events-input"
              />
            </div>

            {/* Juego */}
            <div className="filter-group">
              <label className="filter-label">Juego</label>
              <input
                name="game"
                value={filters.game}
                onChange={onFilterChange}
                placeholder="Ej: Smash Bros, FIFA..."
                className="events-input"
              />
            </div>

            {/* Tipo */}
            <div className="filter-group">
              <label className="filter-label">Tipo</label>
              <select
                name="type"
                value={filters.type}
                onChange={onFilterChange}
                className="events-input"
              >
                <option value="">Todos</option>
                <option value="individual">Individual</option>
                <option value="equipo">Por Equipos</option>
                <option value="torneo">Torneo</option>
                <option value="competencia">Competencia</option>
              </select>
            </div>

            {/* Precio */}
            <div className="filter-group">
              <label className="filter-label">Precio Mínimo</label>
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={onFilterChange}
                placeholder="0"
                min="0"
                className="events-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Precio Máximo</label>
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={onFilterChange}
                placeholder="Sin límite"
                min="0"
                className="events-input"
              />
            </div>

            {/* Modalidad */}
            <div className="filter-group">
              <label className="filter-label">Modalidad</label>
              <select
                name="modality"
                value={filters.modality}
                onChange={onFilterChange}
                className="events-input"
              >
                <option value="">Todas</option>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="hibrida">Híbrida</option>
              </select>
            </div>

            {/* Organizador */}
            <div className="filter-group">
              <label className="filter-label">Organizador</label>
              <input
                name="organizer"
                value={filters.organizer}
                onChange={onFilterChange}
                placeholder="Email del organizador"
                className="events-input"
              />
            </div>
          </div>
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
