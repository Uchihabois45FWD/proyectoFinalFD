import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { authService } from '../services/AuthServices'
import '../styles/Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const isAuth = authService.isAuthenticated()
  const isAdmin = authService.isAdmin()
  const isUser = authService.isUser()
  const isColab = authService.isCollaborator()

  const handleLogout = () => {
    authService.logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar__brand" onClick={() => navigate(isAdmin ? '/Admin' : '/Events')} role="button" tabIndex={0}>
        <span className="navbar__logo">🎟️</span>
        <span className="navbar__title">Eventos</span>
      </div>

      <div className="navbar__links">
        {isAuth && (
          <>
            {isAdmin && (
              <>
                <NavLink to="/Admin#users" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Usuarios</NavLink>
                <NavLink to="/Admin#collaborators" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Colaboradores</NavLink>
                <NavLink to="/Admin#events" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Eventos</NavLink>
              </>
            )}
            {isUser && !isAdmin && !isColab && (
              <>
                <NavLink to="/Events" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Eventos</NavLink>
                <NavLink to="/Users" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Perfil</NavLink>
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
