import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { eventsService } from '../../services/EventsService.jsx'
import { authService } from '../../services/AuthServices.jsx'
import '../../styles/events/Events.css'

function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const user = authService.getCurrentUser()
  const isUser = authService.isUser()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await eventsService.getById(id)
        setEvent(data)
        if (user && Array.isArray(user.savedEvents)) {
          setIsSaved(user.savedEvents.includes(data.id))
        }
      } catch (e) {
        console.error('Error cargando evento:', e)
        setError('No se pudo cargar el evento')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, user])

  if (loading) return <div className="event-detail-loading">Cargando evento...</div>
  if (error) return <div className="event-detail-error">{error}</div>
  if (!event) return <div className="event-detail-not-found">Evento no encontrado</div>

  return (
    <div className="event-detail">
      <h1 className="event-detail-title">Detalle del evento</h1>
      <div className="event-detail-content">
        <p className="event-detail-item"><strong>ID:</strong> {event.id}</p>
        <p className="event-detail-item"><strong>Título:</strong> {event.title || '(Sin título)'}</p>
        <p className="event-detail-item"><strong>Fecha:</strong> {event.date ? new Date(event.date).toLocaleString() : '-'}</p>
        <p className="event-detail-item"><strong>Solicitante:</strong> {event.requester || '-'}</p>
        <p className="event-detail-item"><strong>Estado:</strong> {event.status || 'pending'}</p>
      </div>
      <div className="event-detail-actions">
        {isUser && (
          <button
            className="btn"
            onClick={async () => {
              try {
                if (isSaved) {
                  const next = { ...user, savedEvents: user.savedEvents.filter(x => x !== event.id) }
                  await authService.updateUser(next)
                  setIsSaved(false)
                } else {
                  const next = { ...user, savedEvents: [...(user.savedEvents || []), event.id] }
                  await authService.updateUser(next)
                  setIsSaved(true)
                }
              } catch (e) {
                alert('Error al actualizar eventos guardados')
              }
            }}
          >
            {isSaved ? 'Quitar de guardados' : 'Guardar evento'}
          </button>
        )}
        <Link to="/Events" className="event-detail-link">Volver a eventos</Link>
      </div>
    </div>
  )
}

export default EventDetail
