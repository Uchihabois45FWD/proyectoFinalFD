// Importaciones principales de React y hooks
import React, { useEffect, useState } from 'react';
// Importaciones de React Router para navegación
import { useNavigate, Link } from 'react-router-dom';
// Servicios para autenticación y gestión de eventos
import { authService } from '../services/AuthServices.jsx';
import { eventsService } from '../services/EventsService.jsx';
// Estilos del componente
import '../styles/pages/UserProfile.css';

/**
 * Componente User - Gestiona el perfil del usuario y sus eventos guardados
 * Permite ver y actualizar la información del perfil, así como gestionar eventos guardados
 */
function User() {
  // Hook de navegación para redireccionar al usuario
  const navigate = useNavigate()
  
  // Estados del componente
  const [user, setUser] = useState(null)           // Datos del usuario actual
  const [saved, setSaved] = useState([])           // Lista de eventos guardados
  const [loadingSaved, setLoadingSaved] = useState(false)  // Estado de carga de eventos
  const [errorSaved, setErrorSaved] = useState(null)       // Mensajes de error
  const [username, setUsername] = useState('')     // Nombre de usuario editable
  const [photo, setPhoto] = useState(null)         // Archivo de foto seleccionado
  const [photoPreview, setPhotoPreview] = useState(null)  // Vista previa de la foto

  // Efecto para cargar los datos del usuario al montar el componente
  useEffect(() => {
    // Obtiene el usuario actualmente autenticado
    const u = authService.getCurrentUser()
    
    // Si no hay usuario autenticado, redirige al inicio de sesión
    if (!u) {
      navigate('/')
    } else {
      // Actualiza el estado con los datos del usuario
      setUser(u)
      setUsername(u.username || '')
      setPhotoPreview(u.photo || null)  // Establece la foto de perfil si existe
    }
  }, [navigate])  // Solo se ejecuta cuando cambia la función de navegación

  // Efecto para cargar los eventos guardados del usuario
  useEffect(() => {
    // Función asíncrona para cargar los eventos guardados
    const loadSaved = async () => {
      // Si no hay usuario, no hacer nada
      if (!user) return
      
      // Obtiene los IDs de los eventos guardados, asegurando que sea un array
      const ids = Array.isArray(user.savedEvents) ? user.savedEvents : []
      
      // Si no hay eventos guardados, limpia el estado y termina
      if (ids.length === 0) {
        setSaved([])
        return
      }
      
      // Inicia el estado de carga y limpia errores previos
      setLoadingSaved(true)
      setErrorSaved(null)
      
      try {
        // Obtiene todos los eventos
        const all = await eventsService.list()
        
        // Crea un mapa para búsqueda rápida de eventos por ID
        const map = new Map((Array.isArray(all) ? all : []).map(ev => [String(ev.id), ev]))
        
        // Filtra los eventos guardados del usuario
        const details = ids
          .map(id => map.get(String(id)))  // Obtiene el evento por ID
          .filter(Boolean)  // Filtra valores nulos o undefined
          
        // Actualiza el estado con los eventos encontrados
        setSaved(details)
      } catch (e) {
        // Manejo de errores
        console.error('Error cargando eventos guardados:', e)
        setErrorSaved('No se pudieron cargar tus eventos guardados')
      } finally {
        // Finaliza el estado de carga independientemente del resultado
        setLoadingSaved(false)
      }
    }
    
    // Ejecuta la carga de eventos guardados
    loadSaved()
  }, [user])  // Se ejecuta cuando cambia el usuario

  /**
   * Elimina un evento de la lista de guardados del usuario
   * @param {string|number} id - ID del evento a eliminar
   */
  const removeSaved = async (id) => {
    // Si no hay usuario, no hacer nada
    if (!user) return
    
    try {
      // Crea una copia del usuario actualizando la lista de eventos guardados
      const next = { 
        ...user, 
        // Filtra el ID del evento a eliminar, asegurando que savedEvents sea un array
        savedEvents: (Array.isArray(user.savedEvents) ? user.savedEvents : [])
          .filter(x => String(x) !== String(id)) 
      }
      
      // Actualiza el usuario en el servidor
      const updated = await authService.updateUser(next)
      
      // Actualiza el estado local con el usuario actualizado
      setUser(updated)
      
      // Actualiza la lista de eventos guardados en el estado local
      setSaved(prev => prev.filter(ev => String(ev.id) !== String(id)))
    } catch (e) {
      // Manejo de errores
      console.error('Error eliminando de guardados:', e)
      alert('No se pudo quitar el evento de tus guardados')
    }
  }

  /**
   * Maneja el cierre de sesión del usuario
   */
  const handleLogout = () => {
    // Llama al servicio de autenticación para cerrar la sesión
    authService.logout()
    
    // Redirige al usuario a la página de inicio
    navigate('/')
  }

  /**
   * Maneja el cambio de foto de perfil
   * @param {Event} e - Evento de cambio de input de archivo
   */
  const handlePhotoChange = (e) => {
    // Obtiene el archivo seleccionado
    const file = e.target.files[0]
    
    // Si se seleccionó un archivo
    if (file) {
      // Guarda el archivo en el estado
      setPhoto(file)
      
      // Crea un FileReader para generar una vista previa de la imagen
      const reader = new FileReader()
      
      // Cuando termine de cargar la imagen
      reader.onloadend = () => {
        // Guarda la URL de la imagen en el estado para mostrarla como vista previa
        setPhotoPreview(reader.result)
      }
      
      // Lee el archivo como una URL de datos (base64)
      reader.readAsDataURL(file)
    }
  }

  /**
   * Maneja el cambio en el campo de nombre de usuario
   * @param {Event} e - Evento de cambio de input
   */
  const handleUsernameChange = (e) => {
    // Actualiza el estado con el nuevo valor del campo de nombre de usuario
    setUsername(e.target.value)
  }

  /**
   * Maneja el guardado de los cambios del perfil del usuario
   */
  const handleSaveProfile = async () => {
    // Si no hay usuario, no hacer nada
    if (!user) return;
    
    try {
      // Prepara el objeto con los datos actualizados
      const updatedUser = {
        ...user,      // Copia todas las propiedades existentes
        username,     // Actualiza el nombre de usuario
      };
      
      // Si hay una foto nueva, la añade al objeto de actualización
      if (photo) {
        updatedUser.photo = photoPreview;  // Usa la vista previa en base64
      }
      
      // Envía la actualización al servidor
      const updated = await authService.updateUser(updatedUser);
      
      // Actualiza el estado con la respuesta del servidor
      setUser(updated);
      
      // Muestra un mensaje de éxito
      alert('Perfil actualizado correctamente');
    } catch (error) {
      // Manejo de errores
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
    }
  };

  // Renderizado del componente
  return (
    <div className="user-profile">
      {/* Tarjeta de perfil del usuario */}
      <section className="profile-card">
        {/* Encabezado con nombre y rol */}
        <div className="profile-header">
          <h1 className="profile-title">{user?.name || 'Usuario'}</h1>
          <p className="profile-subtitle">
            {user?.role === 'admin' ? 'Administrador' : 
             user?.role === 'colab' ? 'Colaborador registrado' : 
             'Usuario registrado'}
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