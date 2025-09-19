import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LoginUser from '../pages/LoginUser'

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginUser />} />
      </Routes>
    </Router>
  )
}

export default Routing