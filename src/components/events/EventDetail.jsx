import React, { useEffect, useState, useMemo, useCallback } from 'react'
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
  const user = useMemo(() => authService.getCurrentUser(), [])
  const isUser = useMemo(() => authService.isUser(), [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await eventsService.getById(id)
        setEvent(data)
        if (user && Array.isArray(user.savedEvents)) {
          setIsSaved(user.savedEvents.includes(String(data.id)))
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

  const toggleSaved = useCallback(async () => {
    if (!user || !event) return
    try {
      if (isSaved) {
        const next = { ...user, savedEvents: user.savedEvents.filter(x => x !== String(event.id)) }
        await authService.updateUser(next)
        setIsSaved(false)
      } else {
        const next = { ...user, savedEvents: [...(user.savedEvents || []), String(event.id)] }
        await authService.updateUser(next)
        setIsSaved(true)
      }
    } catch (e) {
      alert('Error al actualizar eventos guardados')
    }
  }, [user, event, isSaved])

  if (loading) return <div className="event-detail-loading">Cargando evento...</div>
  if (error) return <div className="event-detail-error">{error}</div>
  if (!event) return <div className="event-detail-not-found">Evento no encontrado</div>

  return (
    <div className="detail">
      <h1 className="detail-title">{event.title || 'Detalle del evento'}</h1>
      <div className="detail-content">
        {/* Información del evento */}
        <div className="detail-section">
          <h3>Información General</h3>
          <p className="detail-item"><strong>ID:</strong> {event.id}</p>
          <p className="detail-item"><strong>Título:</strong> {event.title || '(Sin título)'}</p>
          <p className="detail-item"><strong>Descripción:</strong> {event.description || '(Sin descripción)'}</p>
          <p className="detail-item"><strong>Categoría/Juego:</strong> {event.category || '-'}</p>
          <p className="detail-item"><strong>Solicitante:</strong> {event.requester || '-'}</p>
          <p className="detail-item"><strong>Estado:</strong> {event.status || 'pending'}</p>
        </div>

        {/* Fechas del evento */}
        <div className="detail-section">
          <h3>Fechas y Horarios</h3>
          <p className="detail-item"><strong>Fecha de inicio:</strong> {event.startDate ? new Date(event.startDate).toLocaleString() : '-'}</p>
          <p className="detail-item"><strong>Fecha de fin:</strong> {event.endDate ? new Date(event.endDate).toLocaleString() : '-'}</p>
        </div>

        {/* Ubicación del evento */}
        {(event.location?.address || event.location?.coordinates) && (
          <div className="detail-section">
            <h3>Ubicación</h3>
            {event.location?.address && (
              <p className="detail-item"><strong>Dirección:</strong> {event.location.address}</p>
            )}
            {event.location?.coordinates && (
              <p className="detail-item"><strong>Coordenadas:</strong> {event.location.coordinates.join(', ')}</p>
            )}
          </div>
        )}

        {/* Detalles del evento */}
        <div className="detail-section">
          <h3>Detalles del Evento</h3>
          <p className="detail-item"><strong>Modalidad:</strong> {event.modality || '-'}</p>
          <p className="detail-item"><strong>Formato:</strong> {event.format || '-'}</p>
          <p className="detail-item"><strong>Máximo participantes:</strong> {event.maxParticipants || '-'}</p>
          <p className="detail-item"><strong>Costo de inscripción:</strong> {event.price ? `₡${event.price}` : 'Gratis'}</p>
        </div>

        {/* Premios y reglas del evento */}
        {(event.prizes || event.rules) && (
          <div className="detail-section">
            <h3>Premios y Reglas</h3>
            {event.prizes && (
              <p className="detail-item"><strong>Premios:</strong> {event.prizes}</p>
            )}
            {event.rules && (
              <p className="detail-item"><strong>Reglas:</strong> {event.rules}</p>
            )}
          </div>
        )}

        {/* Contacto y enlaces del evento */}
        <div className="detail-section">
          <h3>Contacto y Enlaces</h3>
          <p className="detail-item"><strong>Información de contacto:</strong> {event.contact || '-'}</p>
          {event.registrationLink && (
            <p className="detail-item"><strong>Enlace de inscripción:</strong> <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">{event.registrationLink}</a></p>
          )}
          {event.streamLink && (
            <p className="detail-item"><strong>Enlace de transmisión:</strong> <a href={event.streamLink} target="_blank" rel="noopener noreferrer">{event.streamLink}</a></p>
          )}
        </div>

        {/* Galería de imágenes del evento */}
        {event.images && Array.isArray(event.images) && event.images.length > 0 && (
          <div className="detail-section">
            <h3>Galería de Imágenes</h3>
            <div className="detail-images">
              {event.images.map((img, index) => (
                <img key={index} src={img} alt={`Imagen ${index + 1} del evento`} className="detail-image" />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="detail-actions">
        {isUser && (
          <button
            className="btn"
            onClick={toggleSaved}
          >
            {isSaved ? 'Quitar de guardados' : 'Guardar evento'}
          </button>
        )}
        <Link to="/Events" className="detail-link">Volver a eventos</Link>
      </div>
    </div>
  )
}

export default EventDetail
