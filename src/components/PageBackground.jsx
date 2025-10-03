import React from 'react'
import '../styles/PageBackground.css'

function PageBackground({ children, backgroundClass }) {
  return (
    <div className={`page-background ${backgroundClass}`}>
      {children}
    </div>
  )
}

export default PageBackground