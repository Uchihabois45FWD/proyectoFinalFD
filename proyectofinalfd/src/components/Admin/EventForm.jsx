import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function ClickCatcher({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng)
    },
  })
  return null
}

function LocationMarker({ position }) {
  if (!position) return null
  return (
    <Marker position={position}>
      <Popup>Ubicación del evento</Popup>
    </Marker>
  )
}

export default function EventForm({ event, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: { address: '', coordinates: null },
    modality: 'presencial',
    category: '',
    format: 'individual',
    maxParticipants: 1,
    price: 0,
    prizes: '',
    rules: '',
    registrationLink: '',
    streamLink: '',
    contact: '',
    images: [],
  })
  const [currentImage, setCurrentImage] = useState('')

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        startDate: event.startDate || event.date || '',
        endDate: event.endDate || '',
        location: event.location || { address: '', coordinates: null },
        modality: event.modality || 'presencial',
        category: event.category || '',
        format: event.format || 'individual',
        maxParticipants: event.maxParticipants || 1,
        price: event.price || 0,
        prizes: event.prizes || '',
        rules: event.rules || '',
        registrationLink: event.registrationLink || '',
        streamLink: event.streamLink || '',
        contact: event.contact || '',
        images: Array.isArray(event.images) ? event.images : [],
      })
    }
  }, [event])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleLocationChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }))
  }

  const handleMapSelect = (latlng) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates: [latlng.lat, latlng.lng],
      },
    }))
  }

  const handleAddImage = () => {
    if (currentImage.trim()) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, currentImage.trim()] }))
      setCurrentImage('')
    }
  }

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Normalizamos algunos campos para compatibilidad
    const payload = {
      ...formData,
      // mantener un campo date para compatibilidad hacia atrás
      date: formData.startDate || formData.date || '',
    }
    onSave(payload)
  }

  return (
    <div className="event-form-container">
      <h2>{event && event.id ? 'Editar Evento' : 'Nuevo Evento'}</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label>Título*</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Descripción*</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fecha y hora de inicio*</label>
            <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Fecha y hora de fin*</label>
            <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Modalidad*</label>
          <select name="modality" value={formData.modality} onChange={handleChange} required>
            <option value="presencial">Presencial</option>
            <option value="online">En línea</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>

        {formData.modality !== 'online' && (
          <div className="form-group">
            <label>Dirección</label>
            <input type="text" name="address" value={formData.location.address} onChange={handleLocationChange} required={formData.modality !== 'online'} />
          </div>
        )}

        {formData.modality !== 'online' && (
          <div className="form-group map-container">
            <label>Ubicación en el mapa</label>
            <div style={{ height: '300px', width: '100%', marginTop: 10 }}>
              <MapContainer center={[9.9281, -84.0907]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                <ClickCatcher onSelect={handleMapSelect} />
                {Array.isArray(formData.location.coordinates) && formData.location.coordinates.length === 2 && (
                  <LocationMarker position={{ lat: formData.location.coordinates[0], lng: formData.location.coordinates[1] }} />
                )}
              </MapContainer>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Categoría/Juego*</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Formato*</label>
          <select name="format" value={formData.format} onChange={handleChange} required>
            <option value="individual">Individual</option>
            <option value="equipos">Equipos</option>
          </select>
        </div>

        <div className="form-group">
          <label>Número máximo de {formData.format === 'individual' ? 'participantes' : 'equipos'}*</label>
          <input type="number" name="maxParticipants" min={1} value={formData.maxParticipants} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Costo de inscripción (colones costarricenses)</label>
          <input type="number" name="price" min={0} step={0.01} value={formData.price} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Premios</label>
          <textarea name="prizes" value={formData.prizes} onChange={handleChange} rows={3} />
        </div>

        <div className="form-group">
          <label>Reglas</label>
          <textarea name="rules" value={formData.rules} onChange={handleChange} rows={3} />
        </div>

        <div className="form-group">
          <label>Enlace de inscripción</label>
          <input type="url" name="registrationLink" value={formData.registrationLink} onChange={handleChange} placeholder="https://ejemplo.com/inscripcion" />
        </div>

        <div className="form-group">
          <label>Enlace de transmisión (stream)</label>
          <input type="url" name="streamLink" value={formData.streamLink} onChange={handleChange} placeholder="https://twitch.tv/canal" />
        </div>

        <div className="form-group">
          <label>Información de contacto*</label>
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} required placeholder="Correo o teléfono de contacto" />
        </div>

        <div className="form-group">
          <label>Galería de imágenes</label>
          <div className="image-upload">
            <input type="text" value={currentImage} onChange={(e) => setCurrentImage(e.target.value)} placeholder="URL de la imagen" />
            <button type="button" onClick={handleAddImage} className="btn btn--secondary">Agregar imagen</button>
          </div>
          <div className="image-preview">
            {formData.images.map((img, i) => (
              <div key={i} className="image-preview-item">
                <img src={img} alt={`Imagen ${i + 1}`} />
                <button type="button" className="btn btn--danger btn--small" onClick={() => handleRemoveImage(i)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn--secondary">Cancelar</button>
          <button type="submit" className="btn btn--primary">{event && event.id ? 'Actualizar evento' : 'Crear evento'}</button>
        </div>
      </form>
    </div>
  )
}
