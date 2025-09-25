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
      <div className="navbar__brand" onClick={() => navigate(isAdmin ? '/Approved-Events' : '/Events')} role="button" tabIndex={0}>
        <span className="navbar__logo">🎟️</span>
        <span className="navbar__title">Eventos</span>
      </div>

      <div className="navbar__links">
        {isAuth && (
          <>
            {isAdmin && (
              <NavLink to="/Approved-Events" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Aprobados</NavLink>
            )}
            {isAdmin && (
              <NavLink to="/Admin" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Admin</NavLink>
            )}
            {isUser && (
              <NavLink to="/Users" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Perfil</NavLink>
            )}
            {isUser && (
              <NavLink to="/Events" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Calendario</NavLink>
            )}
            {isColab && (
              <NavLink to="/Colab" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Colaborador</NavLink>
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
