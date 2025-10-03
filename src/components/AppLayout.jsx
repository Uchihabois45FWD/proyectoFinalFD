// Importaciones principales de React
import React from 'react'
// Componente de barra de navegación
import Navbar from './Navbar'
// Estilos generales de la aplicación
import '../styles/admin/Admin.css'

/**
 * Componente AppLayout - Proporciona un diseño consistente para toda la aplicación
 * Maneja el diseño general, incluyendo la barra de navegación y el contenido principal
 * 
 * Propiedades del componente
 * children: Componentes hijos que se renderizarán dentro del layout
 */
function AppLayout({ children }) {
  // Determina si la página actual es una página de autenticación
  const isAuthPage = typeof window !== 'undefined' && 
    (window.location.pathname === '/LoginMenu' || 
     window.location.pathname === '/RegisterForm')

  return (
    // Contenedor principal del layout
    <div className="app-layout">
      {/* Barra de navegación que se muestra en todas las páginas */}
      <Navbar />
      
      {/* Contenido principal de la aplicación */}
      <main className="app-content">
        {isAuthPage ? (
          // Para páginas de autenticación, renderiza los hijos directamente
          // ya que manejan su propio diseño a pantalla completa
          <>{children}</>
        ) : (
          // Para el resto de páginas, aplica un contenedor con efecto de desenfoque
          <div className="container-blur">
            {children}
          </div>
        )}
      </main>
    </div>
  )
}

export default AppLayout
