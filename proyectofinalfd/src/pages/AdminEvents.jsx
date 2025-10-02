import React from 'react'
import EventsPanel from '../components/Admin/EventsPanel'
import '../styles/admin/Admin.css'

function AdminEvents() {
  return (
    <div className="admin-app">
      <main className="admin-main">
        <div className="admin-content">
          <EventsPanel />
        </div>
      </main>
    </div>
  )
}

export default AdminEvents
