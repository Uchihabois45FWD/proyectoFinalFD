import React from 'react'
import '../styles/admin/Admin.css'
import UsersTable from '../components/Admin/UsersTable'

function AdminUsers() {
  return (
    <div className="admin-app">
      <main className="admin-main">
        <div className="admin-content">
          <UsersTable />
        </div>
      </main>
    </div>
  )
}

export default AdminUsers
