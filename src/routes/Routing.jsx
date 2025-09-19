import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginMenu from '../pages/LoginMenu'
function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/LoginMenu" element={<LoginMenu />} />
      </Routes>
    </Router>
  )
}

export default Routing