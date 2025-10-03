import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/AuthServices.jsx'
import { eventsService } from '../services/EventsService.jsx'
import EventForm from '../components/Admin/EventForm.jsx'
import '../styles/pages/Colab.css'

/**
 * Componente Colab - Panel de control para colaboradores
 * Permite a los colaboradores gestionar sus eventos propuestos
 */
function Colab() {
  const navigate = useNavigate()
  
  // Estados del componente
  const [user, setUser] = useState(null)           // Datos del usuario actual
  const [showForm, setShowForm] = useState(false)  // Controla la visibilidad del formulario
  const [saving, setSaving] = useState(false)      // Estado de guardado de eventos
  const [message, setMessage] = useState(null)     // Mensajes para el usuario
  const [rows, setRows] = useState([])             // Lista de eventos del colaborador
  const [loading, setLoading] = useState(true)     // Estado de carga de datos
  const [error, setError] = useState(null)         // Mensajes de error
  const [currentEvent, setCurrentEvent] = useState(null)  // Evento actual en edición
  const [statusFilter, setStatusFilter] = useState('all') // Filtro de estado de eventos

  // Efecto para verificar la autenticación y el rol del usuario al montar el componente
  useEffect(() => {
    // Obtiene el usuario actualmente autenticado
    const u = authService.getCurrentUser()
    
    // Si no hay usuario autenticado o no es un colaborador, redirige al inicio
    if (!u || !authService.isCollaborator()) {
      navigate('/')
    } else {
      // Si está autenticado y es colaborador, actualiza el estado del usuario
      setUser(u)
    }
  }, [navigate])  // Solo se ejecuta cuando cambia la función de navegación

  // Efecto para cargar los eventos del colaborador cuando cambia el usuario
  useEffect(() => {
    // Función asíncrona para cargar los eventos
    const load = async () => {
      // Si no hay usuario, no hacer nada
      if (!user) return
      
      // Inicia el estado de carga y limpia errores previos
      setLoading(true)
      setError(null)
      
      try {
        // Obtiene todos los eventos
        const data = await eventsService.list()
        
        // Filtra solo los eventos creados por el usuario actual
        const mine = (Array.isArray(data) ? data : []).filter(ev => ev.requester === user.email)
        
        // Actualiza el estado con los eventos filtrados
        setRows(mine)
      } catch (e) {
        // Manejo de errores
        console.error('Error cargando mis eventos:', e)
        setError('No se pudieron cargar tus eventos')
      } finally {
        // Finaliza el estado de carga independientemente del resultado
        setLoading(false)
      }
    }
    
    // Ejecuta la carga de eventos
    load()
  }, [user])  // Se ejecuta cuando cambia el usuario

  /**
   * Maneja el cierre de sesión del usuario
   */
  const handleLogout = () => {
    // Cierra la sesión a través del servicio de autenticación
    authService.logout()
    
    // Redirige al usuario a la página de inicio
    navigate('/')
  }

  /**
   * Maneja el guardado de un evento (creación o actualización)
   * @param {Object} data - Datos del evento a guardar
   */
  const handleSave = async (data) => {
    // Si no hay usuario, no hacer nada
    if (!user) return
    
    try {
      // Inicia el estado de guardado y limpia mensajes previos
      setSaving(true)
      setMessage(null)
      
      // Verifica si es una actualización o creación de evento
      if (currentEvent && currentEvent.id) {
        // Si el evento está aprobado, no permite edición
        if ((currentEvent.status || 'pending') === 'approved') {
          setMessage({ type: 'error', text: 'No es posible editar un evento aprobado.' })
        } else {
          // Actualiza el evento existente
          await eventsService.update(currentEvent.id, { 
            ...currentEvent, 
            ...data, 
            requester: currentEvent.requester || user.email 
          })
          setMessage({ type: 'success', text: 'Evento actualizado.' })
        }
      } else {
        // Crea un nuevo evento
        await eventsService.create({
          ...data,
          requester: user.email,  // Asigna el correo del colaborador
          status: 'pending'       // Estado inicial: pendiente de aprobación
        })
        setMessage({ type: 'success', text: 'Evento creado y enviado para aprobación.' })
      }
      
      // Cierra el formulario y limpia el evento actual
      setShowForm(false)
      setCurrentEvent(null)
      
      // Actualiza la lista de eventos
      const dataList = await eventsService.list()
      const mine = (Array.isArray(dataList) ? dataList : []).filter(ev => ev.requester === user.email)
      setRows(mine)
    } catch (e) {
      // Manejo de errores
      console.error('Error guardando evento:', e)
      setMessage({ type: 'error', text: 'No se pudo crear el evento.' })
    } finally {
      // Finaliza el estado de guardado
      setSaving(false)
    }
  }

  /**
   * Maneja la edición de un evento existente
   * @param {Object} ev - El evento a editar
   */
  const handleEdit = (ev) => {
    // Establece el evento actual para edición y muestra el formulario
    setCurrentEvent(ev)
    setShowForm(true)
  }

  /**
   * Maneja la eliminación de un evento
   * @param {Object} ev - El evento a eliminar
   */
  const handleDelete = async (ev) => {
    // Verifica si el evento está aprobado (no se pueden eliminar eventos aprobados)
    if ((ev.status || 'pending') === 'approved') {
      alert('No es posible eliminar un evento aprobado.')
      return
    }
    
    // Solicita confirmación antes de eliminar
    if (!window.confirm('¿Seguro que deseas eliminar este evento?')) return
    
    try {
      // Inicia el estado de carga
      setLoading(true)
      
      // Elimina el evento usando el servicio
      await eventsService.delete(ev.id)
      
      // Actualiza la lista de eventos
      const dataList = await eventsService.list()
      const mine = (Array.isArray(dataList) ? dataList : []).filter(x => x.requester === user.email)
      setRows(mine)
      
      // Muestra mensaje de éxito
      setMessage({ type: 'success', text: 'Evento eliminado.' })
    } catch (e) {
      // Manejo de errores
      console.error('Error eliminando evento:', e)
      setError('No se pudo eliminar el evento')
    } finally {
      // Finaliza el estado de carga
      setLoading(false)
    }
  }

  return (
    <div className="colab-container">
      {/* Encabezado y mensaje de bienvenida */}
      <h1 className="colab-header">Zona de Colaboradores</h1>
      
      {/* Muestra la información del usuario si está autenticado */}
      {user && (
        <p className="colab-welcome">
          Hola{user.name ? `, ${user.name}` : ''}. Acceso otorgado para correo colaborador: <strong>{user.email}</strong>
        </p>
      )}
      
      {/* Muestra mensajes de éxito/error */}
      {message?.text && (
        <div className={`message ${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      {/* Sección de acciones principales */}
      {!showForm ? (
        // Mostrar botones principales cuando el formulario está oculto
        <div className="button-group">
          <button onClick={() => setShowForm(true)} className="btn">Nuevo Evento</button>
          <button onClick={handleLogout} className="btn">Cerrar sesión</button>
        </div>
      ) : (
        // Mostrar formulario de evento cuando se está creando/editando
        <EventForm
          event={currentEvent}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          disabled={saving}
        />
      )}

      {/* Sección de lista de eventos */}
      <h2 style={{ marginTop: 24 }}>Mis eventos</h2>
      
      {/* Controles de filtrado */}
      <div className="view-filter">
        <label>Filtrar por estado:</label>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)} 
          className="view-selector"
        >
          <option value="all">Todos</option>
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobados</option>
          <option value="rejected">Rechazados</option>
        </select>
        <button className="btn" onClick={() => {
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
      {/* Estados de carga y mensajes */}
      {loading && <div>Cargando mis eventos...</div>}
      {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
      
      {/* Renderizado de la tabla de eventos */}
      {!loading && !error && (
        rows.length === 0 ? (
          <div>No has creado eventos.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              {/* Encabezados de la tabla */}
              <thead>
                <tr className="thead-row">
                  <th className="th">ID</th>
                  <th className="th">Título</th>
                  <th className="th">Fecha</th>
                  <th className="th">Estado</th>
                  <th className="th">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .filter(ev => statusFilter === 'all' ? true : (ev.status || 'pending') === statusFilter)
                  .sort((a, b) => {
                    const ta = a.date ? new Date(a.date).getTime() : 0
                    const tb = b.date ? new Date(b.date).getTime() : 0
                    return tb - ta
                  })
                  .map(ev => (
                  <tr key={ev.id}>
                    {/* Columna de ID */}
                    <td className="td">{ev.id}</td>
                    
                    {/* Columna de Título */}
                    <td className="td">{ev.title || '(Sin título)'}</td>
                    
                    {/* Columna de Fecha */}
                    <td className="td">{ev.date ? new Date(ev.date).toLocaleString() : '-'}</td>
                    
                    {/* Columna de Estado con estilos condicionales */}
                    <td className="td">
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 999,
                        fontSize: 12,
                        // Fondo dinámico según el estado
                        background: (ev.status || 'pending') === 'approved' ? '#ecfdf5'
                          : (ev.status || 'pending') === 'rejected' ? '#fef2f2'
                          : '#fffbeb',
                        // Color de texto dinámico según el estado
                        color: (ev.status || 'pending') === 'approved' ? '#065f46'
                          : (ev.status || 'pending') === 'rejected' ? '#991b1b'
                          : '#92400e',
                        border: '1px solid',
                        // Borde dinámico según el estado
                        borderColor: (ev.status || 'pending') === 'approved' ? '#a7f3d0'
                          : (ev.status || 'pending') === 'rejected' ? '#fecaca'
                          : '#fde68a'
                      }}>
                        {/* Texto del estado */}
                        {(ev.status || 'pending') === 'approved' ? 'Aprobado'
                          : (ev.status || 'pending') === 'rejected' ? 'Rechazado'
                          : 'Pendiente'}
                      </span>
                    </td>
                    {/* Columna de Acciones */}
                    <td className="td" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {/* Enlace a la vista detallada del evento */}
                      <Link to={`/Events/${ev.id}`} title="Ver detalles">Detalles</Link>
                      
                      {/* Botón de edición - Deshabilitado si el evento está aprobado */}
                      <button
                        className="btn btn-small"
                        onClick={() => handleEdit(ev)}
                        disabled={(ev.status || 'pending') === 'approved'}
                        title={(ev.status || 'pending') === 'approved' ? 'No editable' : 'Editar'}
                        aria-label="Editar evento"
                      >
                        ✏️
                      </button>
                      
                      {/* Botón de eliminación - Deshabilitado si el evento está aprobado */}
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => handleDelete(ev)}
                        disabled={(ev.status || 'pending') === 'approved'}
                        title={(ev.status || 'pending') === 'approved' ? 'No eliminable' : 'Eliminar'}
                        aria-label="Eliminar evento"
                      >
                        🗑️
                      </button>
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


