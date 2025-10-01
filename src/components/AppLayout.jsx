import React from 'react'
import Navbar from './Navbar'
import '../styles/admin/Admin.css'

function AppLayout({ children }) {
  const isAuthPage = typeof window !== 'undefined' && (window.location.pathname === '/LoginMenu' || window.location.pathname === '/RegisterForm')

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content">
        {isAuthPage ? (
          // Render auth pages directly; they handle full-screen layout themselves
          <>{children}</>
        ) : (
          <div className="container-blur">
            {children}
          </div>
        )}
      </main>
    </div>
  )
}

export default AppLayout
