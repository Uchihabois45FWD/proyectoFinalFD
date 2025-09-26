import React, { useEffect, useMemo, useState } from 'react'
import '../../styles/admin/EventsPanel.css'
import { eventsService } from '../../services/EventsService.jsx'
import EventForm from './EventForm.jsx'

function StatusBadge({ status }) {
  const map = {
    pending: { bg: '#fffbeb', color: '#92400e', border: '#fde68a', label: 'Pendiente' },
    approved: { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0', label: 'Aprobado' },
    rejected: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca', label: 'Rechazado' },
  }
  const s = map[status] || map.pending
  return (
    <span className={`badge badge--${status || 'pending'}`}>{s.label}</span>
  )
}

function EventsPanel() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [viewMode, setViewMode] = useState('pending') // pending | approved | rejected | all
  const headers = useMemo(() => ['ID', 'Título', 'Fecha', 'Solicitante', 'Estado', 'Acciones'], [])

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await eventsService.list()
      setRows(data)
    } catch (e) {
      console.error('Error cargando eventos:', e)
      setError('No se pudieron cargar los eventos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      await fetchEvents()
    }
    if (mounted) load()
    return () => { mounted = false }
  }, [])

  const updateStatus = async (ev, status) => {
    try {
      setBusyId(ev.id)
      await eventsService.updateStatus(ev.id, status)
      await fetchEvents()
    } catch (e) {
      console.error('Error actualizando evento:', e)
      alert('No se pudo actualizar el evento')
    } finally {
      setBusyId(null)
    }
  }

  const filteredRows = useMemo(() => {
    if (viewMode === 'all') return rows
    return rows.filter(ev => (ev.status || 'pending') === viewMode)
  }, [rows, viewMode])

  const handleEdit = (ev) => {
    setCurrentEvent(ev)
    setShowForm(true)
  }

  const handleDuplicate = (ev) => {
    // Duplicar deshabilitado para evitar creación desde Admin
    alert('La duplicación de eventos está deshabilitada en el panel de administrador.')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este evento?')) return
    try {
      await eventsService.delete(id)
      await fetchEvents()
    } catch (e) {
      console.error('Error eliminando evento:', e)
      alert('No se pudo eliminar el evento')
    }
  }

  const handleSave = async (data) => {
    try {
      // En Admin solo se permite actualizar eventos existentes, no crear nuevos
      if (currentEvent && currentEvent.id) {
        await eventsService.update(currentEvent.id, { ...currentEvent, ...data })
      } else {
        alert('La creación de eventos no está permitida desde el panel de administrador.')
      }
      setShowForm(false)
      setCurrentEvent(null)
      await fetchEvents()
    } catch (e) {
      console.error('Error guardando evento:', e)
      alert('No se pudo guardar el evento')
    }
  }

  if (showForm) {
    return (
      <EventForm
        event={currentEvent}
        onSave={handleSave}
        onCancel={() => { setShowForm(false); setCurrentEvent(null) }}
      />
    )
  }

  if (loading) return <div className="events-panel__loading">Cargando eventos...</div>
  if (error) return <div className="events-panel__error">{error}</div>

  return (
    <section className="events-panel">
      <div className="events-panel__header">
        <h2 className="events-panel__title">
          {viewMode === 'pending' ? 'Eventos pendientes' : viewMode === 'approved' ? 'Eventos aprobados' : viewMode === 'rejected' ? 'Eventos rechazados' : 'Todos los eventos'}
        </h2>
        <div className="events-panel__actions">
          <select className="view-selector" value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobados</option>
            <option value="rejected">Rechazados</option>
            <option value="all">Todos</option>
          </select>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr className="thead-row">
              {headers.map(h => (
                <th key={h} className="th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 && (
              <tr>
                <td className="td" colSpan={headers.length}>No hay eventos</td>
              </tr>
            )}
            {filteredRows.map((ev) => (
              <tr key={ev.id}>
                <td className="td">{ev.id}</td>
                <td className="td">{ev.title || '(Sin título)'}</td>
                <td className="td">{(ev.startDate || ev.date) ? new Date(ev.startDate || ev.date).toLocaleString() : '-'}</td>
                <td className="td">{ev.requester || '-'}</td>
                <td className="td"><StatusBadge status={ev.status || 'pending'} /></td>
                <td className="td">
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(ev)} className="btn btn--small" title="Editar">✏️</button>
                    <button onClick={() => handleDuplicate(ev)} className="btn btn--small" title="Duplicar">⎘</button>
                    {ev.status !== 'approved' && (
                      <button onClick={() => updateStatus(ev, 'approved')} disabled={busyId===ev.id} className="btn btn--small btn--success" title="Aprobar">✓</button>
                    )}
                    {ev.status !== 'rejected' && (
                      <button onClick={() => updateStatus(ev, 'rejected')} disabled={busyId===ev.id} className="btn btn--small btn--danger" title="Rechazar">✕</button>
                    )}
                    <button onClick={() => handleDelete(ev.id)} className="btn btn--small btn--danger" title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default EventsPanel
