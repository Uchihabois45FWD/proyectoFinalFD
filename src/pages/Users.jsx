import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/AuthServices.jsx'

function Users() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = authService.getCurrentUser()
    if (!u) {
      navigate('/')
    } else {
      setUser(u)
    }
  }, [navigate])

  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Zona de Usuarios</h1>
      {user && (
        <p>
          Bienvenido{user.name ? `, ${user.name}` : ''}. Rol: <strong>{user.role}</strong>
        </p>
      )}
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}

export default Users
