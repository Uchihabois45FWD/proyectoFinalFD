import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { authService } from '../services/AuthServices' // Servicio de autenticación
import '../styles/Navbar.css'

function Navbar() {
  const navigate = useNavigate() // Hook para navegación programática
  const user = authService.getCurrentUser() // Obtiene usuario actual
  const isAuth = authService.isAuthenticated() // Verifica si está autenticado
  const isAdmin = authService.isAdmin() // Verifica si es administrador
  const isUser = authService.isUser() // Verifica si es usuario regular
  const isColab = authService.isCollaborator() // Verifica si es colaborador
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Estado del menú móvil

  // Función para cerrar sesión y redirigir al login
  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }

  // Función para alternar el menú móvil
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__title">App</span>
        <div className="navbar__hamburger" onClick={toggleMobileMenu} aria-label="Toggle menu" role="button" tabIndex={0}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className={`navbar__links ${mobileMenuOpen ? 'navbar__mobile-menu open' : ''}`}>
        {isAuth && (
          <>
            {isAdmin && (
              <>
                <NavLink to="/AdminUsers" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Usuarios</NavLink>
                <NavLink to="/AdminCollaborators" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Colaboradores</NavLink>
                <NavLink to="/AdminEvents" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Eventos</NavLink>
                <NavLink to="/Admin" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Admin</NavLink>
                <NavLink to="/User" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Perfil</NavLink>
              </>
            )}
            {isUser && !isAdmin && !isColab && (
              <>
                <NavLink to="/Events" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Eventos</NavLink>
                <NavLink to="/User" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Perfil</NavLink>
                <NavLink to="/Calendar" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Calendario</NavLink>
              </>
            )}
            {isColab && !isAdmin && (
              <>
                <NavLink to="/Colab" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Crear eventos</NavLink>
              </>
            )}
          </>
        )}
      </div>

      <div className="navbar__right">
        {user && <span className="navbar__user">Hola, {user.name || user.email}</span>}
        {isAuth ? (
          <button className="btn btn--outline" onClick={handleLogout}>Salir</button>
        ) : (
          <NavLink to="/" className="btn">Ingresar</NavLink>
        )}
      </div>
    </nav>
  )
}

export default Navbar
