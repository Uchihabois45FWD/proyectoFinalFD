import React, { useEffect, useState } from 'react'
import { eventsService } from '../../services/EventsService.jsx'
import { Link } from 'react-router-dom'
import '../../styles/events/ApprovedEvents.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function ApprovedEvents() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await eventsService.list()
        setRows(data.filter(ev => (ev.status || 'pending') === 'approved'))
      } catch (e) {
        console.error('Error cargando eventos aprobados:', e)
        setError('No se pudieron cargar los eventos')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="approved-events">Cargando eventos aprobados...</div>
  if (error) return <div className="approved-events approved-error">{error}</div>

  return (
    <div className="approved-events">
      <div className="approved-header">
        <h1>Eventos aprobados</h1>
        <Link to="/Events" className="back-to-events">Volver a eventos</Link>
      </div>
      {rows.length === 0 ? (
        <p>No hay eventos aprobados.</p>
      ) : (
        <>
        <div className="approved-table-wrapper">
          <table className="approved-table">
            <thead>
              <tr>
                <th className="approved-th">ID</th>
                <th className="approved-th">Título</th>
                <th className="approved-th">Fecha</th>
                <th className="approved-th">Solicitante</th>
                <th className="approved-th">Ver</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(ev => (
                <tr key={ev.id}>
                  <td className="approved-td">{ev.id}</td>
                  <td className="approved-td">{ev.title || '(Sin título)'}</td>
                  <td className="approved-td">{ev.date ? new Date(ev.date).toLocaleString() : '-'}</td>
                  <td className="approved-td">{ev.requester || '-'}</td>
                  <td className="approved-td"><Link to={`/Events/${ev.id}`}>Detalles</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      <div className="approved-map">
        <MapContainer center={[9.9281, -84.0907]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {rows.map(ev => (
            <Marker key={ev.id} position={ev.location?.coordinates || [9.9281, -84.0907]}>
              <Popup>{ev.title}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
        </>
      )}
    </div>
  )
}

export default ApprovedEvents
