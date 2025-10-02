import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/AuthServices.jsx'
import StatsCards from '../components/Admin/StatsCards'
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
        <div className="admin-content">
          <StatsCards />
        </div>
      </main>
    </div>
  )
}

export default Admin
