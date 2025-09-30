import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/AuthServices.jsx'
import { eventsService } from '../services/EventsService.jsx'
import '../styles/pages/UserProfile.css'

function User() {
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
    <div style={{ padding: 24, background: '#f8fafc', minHeight: '100vh' }}>
      <section className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">{user?.name || 'Usuario'}</h1>
          <p className="profile-subtitle">
            {user?.role === 'admin' ? 'Administrador' : user?.role === 'colab' ? 'Colaborador registrado' : 'Usuario registrado'}
          </p>
        </div>
        <div className="profile-grid">
          <div className="profile-item">
            <div className="profile-label">Nombre:</div>
            <div className="profile-value">{(user?.name || '-').split(' ')[0]}</div>
          </div>
          <div className="profile-item">
            <div className="profile-label">Apellido:</div>
            <div className="profile-value">{user?.lastName || (user?.name ? (user.name.split(' ')[1] || '-') : '-')}</div>
          </div>
          <div className="profile-item">
            <div className="profile-label">Segundo Apellido:</div>
            <div className="profile-value">{user?.secondLastName || (user?.name ? (user.name.split(' ')[2] || '-') : '-')}</div>
          </div>
          <div className="profile-item">
            <div className="profile-label">Correo electrónico:</div>
            <div className="profile-value">{user?.email || '-'}</div>
          </div>
          <div className="profile-item">
            <div className="profile-label">Teléfono:</div>
            <div className="profile-value">{user?.phone || '-'}</div>
          </div>
          <div className="profile-item">
            <div className="profile-label">Cédula:</div>
            <div className="profile-value">{user?.idNumber || '-'}</div>
          </div>
        </div>
      </section>

      <div style={{ margin: '12px 0' }}>
        <Link to="/Events">Ver eventos aprobados</Link>
      </div>

      {user?.role === 'user' && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ marginBottom: 12 }}>Eventos guardados</h2>
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
      )}
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}

export default User
