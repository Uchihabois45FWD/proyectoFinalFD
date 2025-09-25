import React from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { authService } from '../../services/AuthServices.jsx'
import '../../styles/admin/Sidebar.css'

function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">Admin</div>
      <nav className="admin-sidebar__nav">
        <NavLink to="/Admin" className="admin-sidebar__link">
          Dashboard
        </NavLink>
        <NavLink to="/Users" className="admin-sidebar__link">
          Zona Usuarios
        </NavLink>
        <NavLink to="/Colab" className="admin-sidebar__link">
          Zona Colab
        </NavLink>
        <NavLink to="/Events" className="admin-sidebar__link">
          Eventos
        </NavLink>
      </nav>
      <button onClick={handleLogout} className="admin-sidebar__logout">Cerrar sesión</button>
    </aside>
  )
}

export default Sidebar
