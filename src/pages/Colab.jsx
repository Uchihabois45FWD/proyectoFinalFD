import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/AuthServices.jsx'

function Colab() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = authService.getCurrentUser()
    // Permitir acceso solo si es colaborador por correo
    if (!u || !authService.isCollaborator()) {
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
      <h1>Zona de Colaboradores</h1>
      {user && (
        <p>
          Hola{user.name ? `, ${user.name}` : ''}. Acceso otorgado para correo colaborador: <strong>{user.email}</strong>
        </p>
      )}
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  )
}

export default Colab

