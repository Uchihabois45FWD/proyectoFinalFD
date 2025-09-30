import React from 'react'
import Header from '../components/Admin/Header'
import EventsPanel from '../components/Admin/EventsPanel'

function AdminEvents() {
  return (
    <div className="admin-app">
      <main className="admin-main">
        <Header title="Gestión de Eventos" />
        <div className="admin-content">
          <EventsPanel />
        </div>
      </main>
    </div>
  )
}

export default AdminEvents
