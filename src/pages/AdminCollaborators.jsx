import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/admin/Admin.css'

function AdminCollaborators() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await axios.get('http://localhost:3001/users')
        if (mounted) setRows((res.data || []).filter(u => u.role === 'colab'))
      } catch (e) {
        console.error('Error cargando colaboradores:', e)
        if (mounted) setError('No se pudieron cargar los colaboradores')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const headers = ['ID', 'Nombre', 'Correo', 'Rol', 'Creado', 'Acciones']

  const reload = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get('http://localhost:3001/users')
      setRows((res.data || []).filter(u => u.role === 'colab'))
    } catch (e) {
      console.error('Error recargando colaboradores:', e)
      setError('No se pudieron cargar los colaboradores')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (u) => {
    try {
      const name = window.prompt('Nuevo nombre:', u.name)
      if (name === null) return
      const role = window.prompt("Rol ('colab'):", u.role)
      if (role === null) return
      if (role !== 'colab') {
        alert("Para colaboradores, el rol debe ser 'colab'.")
        return
      }
      setBusyId(u.id)
      await axios.patch(`http://localhost:3001/users/${u.id}` , { name, role })
      await reload()
    } catch (e) {
      console.error('Error al editar colaborador:', e)
      alert('No se pudo editar el colaborador')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (u) => {
    const ok = window.confirm(`¿Eliminar colaborador ${u.name}?`)
    if (!ok) return
    try {
      setBusyId(u.id)
      await axios.delete(`http://localhost:3001/users/${u.id}`)
      await reload()
    } catch (e) {
      console.error('Error al eliminar colaborador:', e)
      alert('No se pudo eliminar el colaborador')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <div className="users-loading">Cargando colaboradores...</div>
  if (error) return <div className="users-error">{error}</div>

  return (
    <div className="admin-app">
      <main className="admin-main">
        <div className="admin-content">
          <section className="users-section">
            <h2 className="users-section__title">Colaboradores</h2>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr className="thead-row">
                    {headers.map(h => (
                      <th key={h} className="th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((u) => (
                    <tr key={u.id}>
                      <td className="td">{u.id}</td>
                      <td className="td">{u.name}</td>
                      <td className="td">{u.email}</td>
                      <td className="td">{u.role}</td>
                      <td className="td">{new Date(u.createdAt).toLocaleString()}</td>
                      <td className="td">
                        <button onClick={() => handleEdit(u)} disabled={busyId===u.id} className="btn">Editar</button>
                        <button onClick={() => handleDelete(u)} disabled={busyId===u.id} className="btn btn--danger">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminCollaborators
