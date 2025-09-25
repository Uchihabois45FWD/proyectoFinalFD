import React from 'react'
import '../../styles/admin/Header.css'

function Header({ title = 'Panel de Administrador' }) {
  return (
    <header className="admin-header">
      <h1 className="admin-header__title">{title}</h1>
      <div className="admin-header__actions">
        {/* Espacio para acciones futuras (filtros, búsqueda, etc.) */}
      </div>
    </header>
  )
}

export default Header
