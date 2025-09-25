import React from 'react'
import Navbar from './Navbar'

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content">
        {children}
      </main>
    </div>
  )
}

export default AppLayout
