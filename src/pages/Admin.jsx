import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/AuthServices.jsx'
import Header from '../components/Admin/Header'
import StatsCards from '../components/Admin/StatsCards'
import UsersTable from '../components/Admin/UsersTable'
import EventsPanel from '../components/Admin/EventsPanel'
import '../styles/admin/Admin.css'

function Admin() {
  const navigate = useNavigate()

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== 'admin') {
      navigate('/')
    }
  }, [navigate])

  return (
    <div className="admin-app">
      <main className="admin-main">
        <Header title="Dashboard de Administrador" />
        <div className="admin-content">
          <StatsCards />
        </div>
      </main>
    </div>
  )
}

export default Admin
