import React from 'react'

function Calendar() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Calendario</h1>
      <p>Aquí podrás ver el calendario de eventos.</p>
      <div style={{
        marginTop: 16,
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 16,
        background: '#fafafa'
      }}>
        <p style={{ color: '#6b7280' }}>Vista de calendario próximamente…</p>
      </div>
    </div>
  )
}

export default Calendar
