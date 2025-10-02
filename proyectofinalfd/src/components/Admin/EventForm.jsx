// Importaciones principales de React y hooks
import React, { useEffect, useState } from 'react'
// Componentes de react-leaflet para el mapa interactivo
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
// Estilos de Leaflet
import 'leaflet/dist/leaflet.css'

/**
 * Componente ClickCatcher - Captura los clics en el mapa
 * @param {Function} onSelect - Función que se ejecuta al hacer clic en el mapa
 */
function ClickCatcher({ onSelect }) {
  // Usa el hook useMapEvents para capturar eventos del mapa
  useMapEvents({
    // Maneja el evento de clic en el mapa
    click(e) {
      // Llama a la función onSelect con las coordenadas del clic
      onSelect(e.latlng)
    },
  })
  // No renderiza ningún elemento en el DOM
  return null
}

/**
 * Componente LocationMarker - Muestra un marcador en la ubicación del evento
 * Objeto con latitud y longitud {lat: number, lng: number}
 */
function LocationMarker({ position }) {
  // No renderiza nada si no hay posición
  if (!position) return null
  
  // Renderiza un marcador en la posición especificada
  return (
    <Marker position={position}>
      <Popup>Ubicación del evento</Popup>
    </Marker>
  )
}

/**
 * Componente EventForm - Formulario para crear o editar eventos
 * Propiedades del componente
 * [props.event] - Datos del evento a editar (si es una edición)
 * props.onSave - Función que se ejecuta al guardar el formulario
 * props.onCancel - Función que se ejecuta al cancelar la edición
 */
export default function EventForm({ event, onSave, onCancel }) {
  // Estado que almacena todos los datos del formulario
  const [formData, setFormData] = useState({
    title: '',                 // Título del evento
    description: '',           // Descripción detallada
    startDate: '',             // Fecha y hora de inicio
    endDate: '',               // Fecha y hora de finalización
    location: {                // Ubicación del evento
      address: '',             // Dirección en texto
      coordinates: null        // Coordenadas [lat, lng]
    },
    modality: 'presencial',    // Modalidad (presencial/online)
    category: '',              // Categoría del evento
    format: 'individual',      // Formato (individual/equipo)
    maxParticipants: 1,        // Número máximo de participantes
    price: 0,                 // Precio de entrada
    prizes: '',               // Premios del evento
    rules: '',                // Reglas del evento
    registrationLink: '',      // Enlace de registro
    streamLink: '',           // Enlace de transmisión en vivo
    contact: '',              // Información de contacto
    images: [],               // URLs de imágenes del evento
  })
  // Estado para la URL de la imagen que se está agregando
  const [currentImage, setCurrentImage] = useState('')

  /**
   * Efecto que se ejecuta cuando cambia la propiedad 'event'
   * Si se proporciona un evento, actualiza el estado del formulario con sus datos
   */
  useEffect(() => {
    // Solo actualiza si se proporciona un evento
    if (event) {
      setFormData({
        // Usa los valores del evento o valores por defecto
        title: event.title || '',
        description: event.description || '',
        // Compatibilidad con versiones antiguas que usan 'date' en lugar de 'startDate'
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
        // Asegura que images sea siempre un array
        images: Array.isArray(event.images) ? event.images : [],
      })
    }
  }, [event])  // Se ejecuta cuando cambia la propiedad 'event'

  /**
   * Maneja los cambios en los campos del formulario
   * Evento del cambio en el input
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Actualiza el estado del formulario
    setFormData((prev) => ({
      ...prev,
      // Maneja tanto checkboxes como otros tipos de inputs
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  /**
   * Maneja los cambios en los campos de ubicación
   * Evento del cambio en el input
   */
  const handleLocationChange = (e) => {
    const { name, value } = e.target
    
    // Actualiza solo la propiedad de ubicación especificada
    setFormData((prev) => ({
      ...prev,
      location: { 
        ...prev.location,  // Mantiene las demás propiedades de location
        [name]: value     // Actualiza solo la propiedad cambiada
      },
    }))
  }

  /**
   * Maneja la selección de una ubicación en el mapa
   * Objeto con latitud y longitud {lat: number, lng: number}
   */
  const handleMapSelect = (latlng) => {
    // Actualiza las coordenadas de la ubicación con el punto seleccionado
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,  // Mantiene la dirección existente
        coordinates: [latlng.lat, latlng.lng],  // Actualiza las coordenadas
      },
    }))
  }

  /**
   * Agrega una nueva imagen a la lista de imágenes del evento
   */
  const handleAddImage = () => {
    // Solo agrega la imagen si el campo no está vacío
    if (currentImage.trim()) {
      // Añade la nueva imagen al array de imágenes
      setFormData((prev) => ({ 
        ...prev, 
        images: [...prev.images, currentImage.trim()] 
      }))
      // Limpia el campo de entrada
      setCurrentImage('')
    }
  }

  /**
   * Elimina una imagen de la lista de imágenes del evento
   * Índice de la imagen a eliminar
   */
  const handleRemoveImage = (index) => {
    // Filtra el array de imágenes para eliminar la del índice especificado
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  /**
   * Maneja el envío del formulario
   * Evento de envío del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault()  // Evita el comportamiento por defecto del formulario
    
    // Prepara los datos para enviar, asegurando compatibilidad con versiones anteriores
    const payload = {
      ...formData,  // Copia todos los datos del formulario
      // Mantiene el campo 'date' para compatibilidad con código existente
      date: formData.startDate || formData.date || '',
    }
    
    // Llama a la función onSave con los datos del formulario
    onSave(payload)
  }

  // Renderiza el formulario
  return (
    <div className="event-form-container">
      {/* Título dinámico según si es edición o creación */}
      <h2>{event && event.id ? 'Editar Evento' : 'Nuevo Evento'}</h2>
      
      {/* Formulario principal */}
      <form onSubmit={handleSubmit} className="event-form">
        {/* Campo de título */}
        <div className="form-group">
          <label>Título*</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            placeholder="Ingrese el título del evento"
          />
        </div>

        {/* Campo de descripción */}
        <div className="form-group">
          <label>Descripción*</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows={4} 
            required 
            placeholder="Describa el evento en detalle"
          />
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
