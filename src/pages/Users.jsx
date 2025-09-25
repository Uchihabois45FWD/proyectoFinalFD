import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
      <h1>Perfil</h1>
      {user && (
        <p>
          Bienvenido{user.name ? `, ${user.name}` : ''}. Rol: <strong>{user.role}</strong>
        </p>
      )}
      <div style={{ margin: '12px 0' }}>
        <Link to="/Approved-Events">Ver eventos aprobados</Link>
      </div>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}

export default Users
