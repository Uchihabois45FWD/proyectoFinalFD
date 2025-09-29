import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import '../../styles/admin/UsersTable.css'

function UsersTable() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await axios.get('http://localhost:3001/users')
        if (mounted) setRows(res.data || [])
      } catch (e) {
        console.error('Error cargando usuarios:', e)
        if (mounted) setError('No se pudieron cargar los usuarios')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const headers = useMemo(() => ['ID', 'Nombre', 'Correo', 'Rol', 'Creado', 'Acciones'], [])

  const reload = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get('http://localhost:3001/users')
      setRows(res.data || [])
    } catch (e) {
      console.error('Error recargando usuarios:', e)
      setError('No se pudieron cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (u) => {
    try {
      const name = window.prompt('Nuevo nombre:', u.name)
      if (name === null) return
      const role = window.prompt("Rol ('admin' o 'user'):", u.role)
      if (role === null) return
      if (!['admin', 'user'].includes(role)) {
        alert("Rol inválido. Use 'admin' o 'user'.")
        return
      }
      setBusyId(u.id)
      await axios.patch(`http://localhost:3001/users/${u.id}` , { name, role })
      await reload()
    } catch (e) {
      console.error('Error al editar usuario:', e)
      alert('No se pudo editar el usuario')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (u) => {
    const ok = window.confirm(`¿Eliminar usuario ${u.name}?`)
    if (!ok) return
    try {
      setBusyId(u.id)
      await axios.delete(`http://localhost:3001/users/${u.id}`)
      await reload()
    } catch (e) {
      console.error('Error al eliminar usuario:', e)
      alert('No se pudo eliminar el usuario')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <div className="users-loading">Cargando usuarios...</div>
  if (error) return <div className="users-error">{error}</div>

  return (
    <section className="users-section">
      <h2 className="users-section__title">Usuarios</h2>
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
  )
}
 

export default UsersTable