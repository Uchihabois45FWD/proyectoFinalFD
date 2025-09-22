import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginMenu from '../pages/LoginMenu'
import Admin from '../pages/Admin'
import Users from '../pages/Users'
function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginMenu />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Users" element={<Users />} />
      </Routes>
    </Router>
  )
}

export default Routing