import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/admin/StatsCards.css'

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  )
}

function StatsCards() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await axios.get('http://localhost:3001/users')
        if (mounted) setUsers(res.data || [])
      } catch (e) {
        console.error('Error cargando estadísticas:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <div style={{ padding: 12 }}>Cargando estadísticas...</div>

  const total = users.length
  const admins = users.filter(u => u.role === 'admin').length
  const standardUsers = users.filter(u => u.role === 'user').length
  const collaborators = users.filter(u => typeof u.email === 'string' && ['sweetspotCR@gmail.com'].includes(u.email.toLowerCase())).length

  return (
    <section className="stats">
      <Stat label="Usuarios totales" value={total} />
      <Stat label="Administradores" value={admins} />
      <Stat label="Usuarios" value={standardUsers} />
      <Stat label="Colaboradores" value={collaborators} />
    </section>
  )
}

export default StatsCards
