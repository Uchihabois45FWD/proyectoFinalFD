import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/AuthServices.jsx'

function Admin() {
  const navigate = useNavigate()

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== 'admin') {
      navigate('/')
    }
  }, [navigate])

  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Panel de Administrador</h1>
      <p>Has iniciado sesión como administrador.</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}

export default Admin
