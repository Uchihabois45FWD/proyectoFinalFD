import React, { useEffect, useState } from 'react'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isToday, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { eventsService } from '../services/EventsService.jsx'
import { authService } from '../services/AuthServices.jsx'
import { Link } from 'react-router-dom'
import '../styles/events/Events.css'

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isUser = authService.isUser()

  const loadEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await eventsService.list()
      const filtered = Array.isArray(data) ? data : []
      // Users only see approved events
      if (isUser) {
        setEvents(filtered.filter(ev => (ev.status || 'pending') === 'approved'))
      } else {
        setEvents(filtered)
      }
    } catch (e) {
      console.error('Error cargando eventos:', e)
      setError('No se pudieron cargar los eventos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Group events by date (YYYY-MM-DD)
  const eventsByDate = events.reduce((acc, event) => {
    if (event.date) {
      const dateKey = format(new Date(event.date), 'yyyy-MM-dd')
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(event)
    }
    return acc
  }, {})

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  return (
    <div style={{ padding: 24 }}>
      <h1>Calendario de Eventos</h1>
      {loading ? (
        <div className="events-loading">Cargando eventos...</div>
      ) : error ? (
        <div className="events-error">{error}</div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button onClick={prevMonth} style={{ padding: '8px 16px', cursor: 'pointer' }}>Anterior</button>
            <h2>{format(currentMonth, 'MMMM yyyy', { locale: es })}</h2>
            <button onClick={nextMonth} style={{ padding: '8px 16px', cursor: 'pointer' }}>Siguiente</button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            overflow: 'hidden'
          }}>
            {/* Days of week header */}
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} style={{
                padding: '12px',
                background: '#f9fafb',
                fontWeight: 'bold',
                textAlign: 'center',
                borderBottom: '1px solid #e5e7eb'
              }}>
                {day}
              </div>
            ))}
            {/* Calendar days */}
            {calendarDays.map(day => {
              const dateKey = format(day, 'yyyy-MM-dd')
              const dayEvents = eventsByDate[dateKey] || []
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isTodayDate = isToday(day)
              return (
                <div key={dateKey} style={{
                  padding: '12px',
                  minHeight: '100px',
                  background: isCurrentMonth ? (isTodayDate ? '#fef3c7' : '#fff') : '#f9fafb',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    fontWeight: isTodayDate ? 'bold' : 'normal',
                    color: isCurrentMonth ? '#000' : '#9ca3af',
                    marginBottom: '4px'
                  }}>
                    {format(day, 'd')}
                  </div>
                  {dayEvents.map(event => (
                    <Link key={event.id} to={`/Events/${event.id}`} style={{
                      fontSize: '12px',
                      background: event.status === 'approved' ? '#10b981' : '#f59e0b',
                      color: '#fff',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      marginBottom: '2px',
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      textDecoration: 'none'
                    }}>
                      {event.title}
                    </Link>
                  ))}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default Calendar
