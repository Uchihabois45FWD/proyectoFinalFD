import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { eventsService } from '../../services/EventsService.jsx'

function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await eventsService.getById(id)
        setEvent(data)
      } catch (e) {
        console.error('Error cargando evento:', e)
        setError('No se pudo cargar el evento')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div style={{ padding: 16 }}>Cargando evento...</div>
  if (error) return <div style={{ padding: 16, color: '#b91c1c' }}>{error}</div>
  if (!event) return <div style={{ padding: 16 }}>Evento no encontrado</div>

  return (
    <div style={{ padding: 16 }}>
      <h1>Detalle del evento</h1>
      <p><strong>ID:</strong> {event.id}</p>
      <p><strong>Título:</strong> {event.title || '(Sin título)'}</p>
      <p><strong>Fecha:</strong> {event.date ? new Date(event.date).toLocaleString() : '-'}</p>
      <p><strong>Solicitante:</strong> {event.requester || '-'}</p>
      <p><strong>Estado:</strong> {event.status || 'pending'}</p>
      <div style={{ marginTop: 12 }}>
        <Link to="/Approved-Events">Volver a eventos aprobados</Link>
      </div>
    </div>
  )
}

export default EventDetail
