/**
 * Página principal del panel de administración.
 * Controla el acceso restringido solo a usuarios con rol de administrador.
 * Renderiza componentes de estadísticas y gestión administrativa.
 */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/AuthServices.jsx' // Servicio de autenticación
import StatsCards from '../components/Admin/StatsCards' // Componente de estadísticas
import '../styles/admin/Admin.css'

function Admin() {
  // Hook para controlar la navegación programática
  const navigate = useNavigate()

  // Verifica permisos de administrador al cargar el componente
  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== 'admin') {
      navigate('/') // Redirige si no es admin
    }
  }, [navigate])

  return (
    <div className="admin-app">
      <main className="admin-main">
        <div className="admin-content">
          <StatsCards />
        </div>
      </main>
    </div>
  )
}

export default Admin
