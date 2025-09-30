import React from 'react'
import Header from '../components/Admin/Header'
import UsersTable from '../components/Admin/UsersTable'

function AdminUsers() {
  return (
    <div className="admin-app">
      <main className="admin-main">
        <Header title="Gestión de Usuarios" />
        <div className="admin-content">
          <UsersTable />
        </div>
      </main>
    </div>
  )
}

export default AdminUsers
