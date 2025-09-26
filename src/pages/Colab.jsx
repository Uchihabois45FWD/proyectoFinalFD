import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/AuthServices.jsx'
import EventForm from '../components/Admin/EventForm.jsx'
import { eventsService } from '../services/EventsService.jsx'

function Colab() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all') // all | pending | approved | rejected

  useEffect(() => {
    const u = authService.getCurrentUser()
    if (!u || !authService.isCollaborator()) {
      navigate('/')
    } else {
      setUser(u)
    }
  }, [navigate])

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      setError(null)
      try {
        const data = await eventsService.list()
        const mine = (Array.isArray(data) ? data : []).filter(ev => ev.requester === user.email)
        setRows(mine)
      } catch (e) {
        console.error('Error cargando mis eventos:', e)
        setError('No se pudieron cargar tus eventos')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }

  const handleSave = async (data) => {
    if (!user) return
    try {
      setSaving(true)
      setMessage(null)
      if (currentEvent && currentEvent.id) {
        // actualizar existente (solo si no está aprobado)
        if ((currentEvent.status || 'pending') === 'approved') {
          setMessage({ type: 'error', text: 'No es posible editar un evento aprobado.' })
        } else {
          await eventsService.update(currentEvent.id, { ...currentEvent, ...data, requester: currentEvent.requester || user.email })
          setMessage({ type: 'success', text: 'Evento actualizado.' })
        }
      } else {
        await eventsService.create({
          ...data,
          requester: user.email,
          status: 'pending'
        })
        setMessage({ type: 'success', text: 'Evento creado y enviado para aprobación.' })
      }
      setShowForm(false)
      setCurrentEvent(null)
      // refrescar listado
      const dataList = await eventsService.list()
      const mine = (Array.isArray(dataList) ? dataList : []).filter(ev => ev.requester === user.email)
      setRows(mine)
    } catch (e) {
      console.error('Error guardando evento:', e)
      setMessage({ type: 'error', text: 'No se pudo crear el evento.' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (ev) => {
    setCurrentEvent(ev)
    setShowForm(true)
  }

  const handleDelete = async (ev) => {
    if ((ev.status || 'pending') === 'approved') {
      alert('No es posible eliminar un evento aprobado.')
      return
    }
    if (!window.confirm('¿Seguro que deseas eliminar este evento?')) return
    try {
      setLoading(true)
      await eventsService.delete(ev.id)
      const dataList = await eventsService.list()
      const mine = (Array.isArray(dataList) ? dataList : []).filter(x => x.requester === user.email)
      setRows(mine)
      setMessage({ type: 'success', text: 'Evento eliminado.' })
    } catch (e) {
      console.error('Error eliminando evento:', e)
      setError('No se pudo eliminar el evento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Zona de Colaboradores</h1>
      {user && (
        <p>
          Hola{user.name ? `, ${user.name}` : ''}. Acceso otorgado para correo colaborador: <strong>{user.email}</strong>
        </p>
      )}
      {message?.text && (
        <div style={{
          margin: '12px 0',
          padding: '8px 12px',
          borderRadius: 6,
          color: message.type === 'error' ? '#991b1b' : '#065f46',
          background: message.type === 'error' ? '#fef2f2' : '#ecfdf5',
          border: `1px solid ${message.type === 'error' ? '#fecaca' : '#a7f3d0'}`
        }}>
          {message.text}
        </div>
      )}

      {!showForm ? (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <button onClick={() => setShowForm(true)} className="btn btn--primary">Nuevo Evento</button>
          <button onClick={handleLogout} className="btn btn--outline">Cerrar sesión</button>
        </div>
      ) : (
        <EventForm
          event={currentEvent}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          disabled={saving}
        />
      )}

      <h2 style={{ marginTop: 24 }}>Mis eventos</h2>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <label style={{ fontWeight: 500 }}>Filtrar por estado:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="view-selector">
          <option value="all">Todos</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="rejected">Rechazados</option>
        </select>
        <button className="btn btn--secondary" onClick={() => {
          // refrescar listado
          if (!user) return
          (async () => {
            try {
              setLoading(true)
              const data = await eventsService.list()
              const mine = (Array.isArray(data) ? data : []).filter(ev => ev.requester === user.email)
              setRows(mine)
            } catch (e) {
              console.error('Error recargando eventos:', e)
              setError('No se pudieron recargar tus eventos')
            } finally {
              setLoading(false)
            }
          })()
        }}>Refrescar</button>
      </div>
      {loading && <div>Cargando mis eventos...</div>}
      {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
      {!loading && !error && (
        rows.length === 0 ? (
          <div>No has creado eventos.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Ver</th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .filter(ev => statusFilter === 'all' ? true : (ev.status || 'pending') === statusFilter)
                  .sort((a, b) => {
                    const ta = a.date ? new Date(a.date).getTime() : 0
                    const tb = b.date ? new Date(b.date).getTime() : 0
                    return tb - ta // descendente
                  })
                  .map(ev => (
                  <tr key={ev.id}>
                    <td>{ev.id}</td>
                    <td>{ev.title || '(Sin título)'}</td>
                    <td>{ev.date ? new Date(ev.date).toLocaleString() : '-'}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 999,
                        fontSize: 12,
                        background: (ev.status || 'pending') === 'approved' ? '#ecfdf5'
                          : (ev.status || 'pending') === 'rejected' ? '#fef2f2'
                          : '#fffbeb',
                        color: (ev.status || 'pending') === 'approved' ? '#065f46'
                          : (ev.status || 'pending') === 'rejected' ? '#991b1b'
                          : '#92400e',
                        border: '1px solid',
                        borderColor: (ev.status || 'pending') === 'approved' ? '#a7f3d0'
                          : (ev.status || 'pending') === 'rejected' ? '#fecaca'
                          : '#fde68a'
                      }}>
                        {(ev.status || 'pending') === 'approved' ? 'Aprobado'
                          : (ev.status || 'pending') === 'rejected' ? 'Rechazado'
                          : 'Pendiente'}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Link to={`/Events/${ev.id}`}>Detalles</Link>
                      <button
                        className="btn btn--small"
                        onClick={() => handleEdit(ev)}
                        disabled={(ev.status || 'pending') === 'approved'}
                        title={(ev.status || 'pending') === 'approved' ? 'No editable' : 'Editar'}
                      >✏️</button>
                      <button
                        className="btn btn--small btn--danger"
                        onClick={() => handleDelete(ev)}
                        disabled={(ev.status || 'pending') === 'approved'}
                        title={(ev.status || 'pending') === 'approved' ? 'No eliminable' : 'Eliminar'}
                      >🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}

export default Colab

