import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/AuthServices.jsx'
import { eventsService } from '../services/EventsService.jsx'

function Users() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [saved, setSaved] = useState([])
  const [loadingSaved, setLoadingSaved] = useState(false)
  const [errorSaved, setErrorSaved] = useState(null)

  useEffect(() => {
    const u = authService.getCurrentUser()
    if (!u) {
      navigate('/')
    } else {
      setUser(u)
    }
  }, [navigate])

  useEffect(() => {
    const loadSaved = async () => {
      if (!user) return
      const ids = Array.isArray(user.savedEvents) ? user.savedEvents : []
      if (ids.length === 0) {
        setSaved([])
        return
      }
      setLoadingSaved(true)
      setErrorSaved(null)
      try {
        const all = await eventsService.list()
        const map = new Map((Array.isArray(all) ? all : []).map(ev => [String(ev.id), ev]))
        const details = ids
          .map(id => map.get(String(id)))
          .filter(Boolean)
        setSaved(details)
      } catch (e) {
        console.error('Error cargando eventos guardados:', e)
        setErrorSaved('No se pudieron cargar tus eventos guardados')
      } finally {
        setLoadingSaved(false)
      }
    }
    loadSaved()
  }, [user])

  const removeSaved = async (id) => {
    if (!user) return
    try {
      const next = { ...user, savedEvents: (Array.isArray(user.savedEvents) ? user.savedEvents : []).filter(x => String(x) !== String(id)) }
      const updated = await authService.updateUser(next)
      setUser(updated)
      setSaved(prev => prev.filter(ev => String(ev.id) !== String(id)))
    } catch (e) {
      console.error('Error eliminando de guardados:', e)
      alert('No se pudo quitar el evento de tus guardados')
    }
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Perfil</h1>
      {user && (
        <p>
          Bienvenido{user.name ? `, ${user.name}` : ''}. Rol: <strong>{user.role}</strong>
        </p>
      )}
      <div style={{ margin: '12px 0' }}>
        <Link to="/Approved-Events">Ver eventos aprobados</Link>
      </div>

      <section style={{ marginTop: 24 }}>
        <h2>Eventos guardados</h2>
        {loadingSaved && <div>Cargando tus eventos guardados...</div>}
        {errorSaved && <div style={{ color: '#b91c1c' }}>{errorSaved}</div>}
        {!loadingSaved && !errorSaved && (
          saved.length === 0 ? (
            <p>No tienes eventos guardados.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ minWidth: 600 }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {saved.map(ev => (
                    <tr key={ev.id}>
                      <td>{ev.id}</td>
                      <td>{ev.title || '(Sin título)'}</td>
                      <td>{ev.date ? new Date(ev.date).toLocaleString() : '-'}</td>
                      <td style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/Events/${ev.id}`}>Ver</Link>
                        <button className="btn btn--small btn--danger" onClick={() => removeSaved(ev.id)}>Quitar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </section>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}

export default Users
