import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/AuthServices.jsx';
import { eventsService } from '../services/EventsService.jsx';
import '../styles/pages/UserProfile.css';

function User() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [saved, setSaved] = useState([])
  const [loadingSaved, setLoadingSaved] = useState(false)
  const [errorSaved, setErrorSaved] = useState(null)
  const [username, setUsername] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  useEffect(() => {
    const u = authService.getCurrentUser()
    if (!u) {
      navigate('/')
    } else {
      setUser(u)
      setUsername(u.username || '')
      setPhotoPreview(u.photo || null)
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const updatedUser = {
        ...user,
        username,
      };
      if (photo) {
        // For simplicity, store photo as base64 string in user.photo
        updatedUser.photo = photoPreview;
      }
      const updated = await authService.updateUser(updatedUser);
      setUser(updated);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="user-profile">
      <section className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">{user?.name || 'Usuario'}</h1>
          <p className="profile-subtitle">
            {user?.role === 'admin' ? 'Administrador' : user?.role === 'colab' ? 'Colaborador registrado' : 'Usuario registrado'}
          </p>
        </div>
        <div className="profile-grid">
          <div className="profile-item profile-photo-item">
            <div className="profile-label">Foto de Perfil:</div>
            <div className="profile-value">
              {photoPreview ? (
                <img src={photoPreview} alt="Foto de Perfil" className="profile-photo" />
              ) : (
                <div className="profile-photo-placeholder">Sin foto</div>
              )}
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
            </div>
          </div>
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
            <div className="profile-label">Correo electr nico:</div>
            <div className="profile-value">{user?.email || '-'}</div>
          </div>
          <div className="profile-item">
            <div className="profile-label">Telefono:</div>
            <div className="profile-value">{user?.phone || '-'}</div>
          </div>
          <div className="profile-item">
            <div className="profile-label">Usuario:</div>
            <div className="profile-value">{user?.username || '-'}</div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn btn--primary" onClick={handleSaveProfile}>Guardar cambios</button>
        </div>
      </section>

      <div className="profile-actions">
        <Link to="/Events" className="events-link">Ver eventos aprobados</Link>
      </div>

      {user?.role === 'user' && (
        <section className="saved-events">
          <h2 className="section-title">Eventos guardados</h2>
          {loadingSaved && <div className="loading-message">Cargando tus eventos guardados...</div>}
          {errorSaved && <div className="error-message">{errorSaved}</div>}
          {!loadingSaved && !errorSaved && (
            saved.length === 0 ? (
              <p className="no-events">No tienes eventos guardados.</p>
            ) : (
              <div className="events-grid">
                {saved.map(ev => {
                  const eventDate = ev.date ? new Date(ev.date) : null;
                  const formattedDate = eventDate ? eventDate.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    weekday: 'long'
                  }) : '-';
                  const formattedTime = eventDate ? eventDate.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : '';

                  return (
                    <div key={ev.id} className="event-card">
                      <div className="event-header">
                        <div className="event-date">{formattedDate}</div>
                        <h3 className="event-title">{ev.title || 'Evento sin título'}</h3>
                        {ev.location?.address && (
                          <div className="event-location">
                            📍 {ev.location.address}
                          </div>
                        )}
                      </div>
                      <div className="event-details">
                        <div className="event-meta">
                          {formattedTime && (
                            <span className="event-time">
                              🕒 {formattedTime} hs
                            </span>
                          )}
                          <span className="event-id">ID: {ev.id}</span>
                        </div>
                      </div>
                      <div className="event-actions">
                        <Link
                          to={`/Events/${ev.id}`}
                          className="action-button view-button"
                          title="Ver detalles del evento"
                          aria-label={`Ver detalles de ${ev.title || 'este evento'}`}
                        >
                          👁️ Ver detalles
                        </Link>
                        <button
                          type="button"
                          className="action-button remove-button"
                          onClick={() => removeSaved(ev.id)}
                          title="Quitar de guardados"
                          aria-label={`Quitar ${ev.title || 'este evento'} de guardados`}
                        >
                          🗑️ Quitar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </section>
      )}
    </div>
  )
}

export default User