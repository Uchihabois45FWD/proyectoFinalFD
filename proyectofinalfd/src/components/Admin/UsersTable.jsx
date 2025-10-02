/**
 * Componente UsersTable - Muestra una tabla de usuarios con funcionalidad de edición y eliminación
 * Permite a los administradores gestionar los usuarios del sistema
 */
function UsersTable() {
  // Estado para almacenar la lista de usuarios
  const [rows, setRows] = useState([])
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true)
  // Estado para manejar mensajes de error
  const [error, setError] = useState(null)
  // Estado para rastrear qué usuario está en proceso de edición/eliminación
  const [busyId, setBusyId] = useState(null)

  /**
   * Efecto que se ejecuta al montar el componente para cargar la lista de usuarios
   * Incluye limpieza para evitar actualizaciones de estado después de desmontar
   */
  useEffect(() => {
    let mounted = true
    
    // Función asíncrona para cargar los usuarios
    const load = async () => {
      try {
        // Realiza la petición GET a la API de usuarios
        const res = await axios.get('http://localhost:3001/users')
        // Actualiza el estado solo si el componente sigue montado
        if (mounted) setRows(res.data || [])
      } catch (e) {
        console.error('Error cargando usuarios:', e)
        // Establece el mensaje de error si hay un problema
        if (mounted) setError('No se pudieron cargar los usuarios')
      } finally {
        // Finaliza el estado de carga
        if (mounted) setLoading(false)
      }
    }
    
    // Ejecuta la carga de usuarios
    load()
    
    // Función de limpieza que se ejecuta al desmontar el componente
    return () => { 
      mounted = false 
    }
  }, [])

  // Memoiza los encabezados de la tabla para evitar recreación en cada renderizado
  const headers = useMemo(() => ['ID', 'Nombre', 'Correo', 'Rol', 'Creado', 'Acciones'], [])

  /**
   * Recarga la lista de usuarios desde el servidor
   */
  const reload = async () => {
    // Inicia el estado de carga y limpia errores previos
    setLoading(true)
    setError(null)
    
    try {
      // Realiza la petición GET para obtener los usuarios actualizados
      const res = await axios.get('http://localhost:3001/users')
      // Actualiza la lista de usuarios
      setRows(res.data || [])
    } catch (e) {
      console.error('Error recargando usuarios:', e)
      // Establece el mensaje de error en caso de fallo
      setError('No se pudieron cargar los usuarios')
    } finally {
      // Finaliza el estado de carga independientemente del resultado
      setLoading(false)
    }
  }

  /**
   * Maneja la edición de un usuario existente
   * Usuario a editar
   */
  const handleEdit = async (u) => {
    try {
      // Solicita el nuevo nombre del usuario
      const name = window.prompt('Nuevo nombre:', u.name)
      if (name === null) return  // Usuario canceló la operación
      
      // Solicita el nuevo rol del usuario
      const role = window.prompt("Rol ('admin','user' o 'colab'):", u.role)
      if (role === null) return  // Usuario canceló la operación
      
      // Valida que el rol sea uno de los permitidos
      if (!['admin', 'user', 'colab'].includes(role)) {
        alert("Rol inválido. Use 'admin', 'user' o 'colab'.")
        return
      }
      
      // Marca el usuario como ocupado para deshabilitar los botones
      setBusyId(u.id)
      
      // Envía la petición PATCH para actualizar el usuario
      await axios.patch(`http://localhost:3001/users/${u.id}`, { name, role })
      
      // Recarga la lista de usuarios para reflejar los cambios
      await reload()
    } catch (e) {
      console.error('Error al editar usuario:', e)
      alert('No se pudo editar el usuario')
    } finally {
      // Libera el bloqueo del usuario
      setBusyId(null)
    }
  }

  /**
   * Maneja la eliminación de un usuario
   * Usuario a eliminar
   */
  const handleDelete = async (u) => {
    // Solicita confirmación antes de eliminar
    const ok = window.confirm(`¿Eliminar usuario ${u.name}?`)
    if (!ok) return  // Usuario canceló la operación
    
    try {
      // Marca el usuario como ocupado para deshabilitar los botones
      setBusyId(u.id)
      
      // Envía la petición DELETE para eliminar el usuario
      await axios.delete(`http://localhost:3001/users/${u.id}`)
      
      // Recarga la lista de usuarios para reflejar los cambios
      await reload()
    } catch (e) {
      console.error('Error al eliminar usuario:', e)
      alert('No se pudo eliminar el usuario')
    } finally {
      // Libera el bloqueo del usuario
      setBusyId(null)
    }
  }

  // Muestra un indicador de carga mientras se cargan los datos
  if (loading) return <div className="users-loading">Cargando usuarios...</div>
  
  // Muestra un mensaje de error si ocurrió un problem al cargar los datos
  if (error) return <div className="users-error">{error}</div>

  return (
    // Contenedor principal de la sección de usuarios
    <section className="users-section">
      {/* Título de la sección */}
      <h2 className="users-section-title"> Usuarios</h2>
      
      {/* Contenedor de la tabla con estilo de desplazamiento */}
      <div className="table-wrapper">
        <table className="table">
          {/* Encabezados de la tabla */}
          <thead>
            <tr className="thead-row">
              {headers.map(h => (
                <th key={h} className="th">{h}</th>
              ))}
            </tr>
          </thead>
          
          {/* Cuerpo de la tabla */}
          <tbody>
            {/* Mapea cada usuario a una fila de la tabla */}
            {rows.map((u) => (
              <tr key={u.id}>
                {/* Celda de ID */}
                <td className="td">{u.id}</td>
                
                {/* Celda de nombre */}
                <td className="td">{u.name}</td>
                
                {/* Celda de correo electrónico */}
                <td className="td">{u.email}</td>
                
                {/* Celda de rol */}
                <td className="td">{u.role}</td>
                
                {/* Celda de fecha de creación formateada */}
                <td className="td">{new Date(u.createdAt).toLocaleString()}</td>
                
                {/* Celda de acciones */}
                <td className="td">
                  {/* Botón para editar el usuario */}
                  <button 
                    onClick={() => handleEdit(u)} 
                    disabled={busyId===u.id} 
                    className="btn"
                    title="Editar usuario"
                  >
                    Editar
                  </button>
                  
                  {/* Botón para eliminar el usuario */}
                  <button 
                    onClick={() => handleDelete(u)} 
                    disabled={busyId===u.id} 
                    className="btn btn--danger"
                    title="Eliminar usuario"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}