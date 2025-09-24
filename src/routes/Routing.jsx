import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import LoginMenu from '../pages/LoginMenu'
import Admin from '../pages/Admin'
import Users from '../pages/Users'
import { authService } from '../services/AuthServices'
import Colab from '../pages/colab'

function Routing() {
  // Wrappers de protección
  const ProtectedRoute = ({ children }) => {
    return authService.isAuthenticated() ? children : <Navigate to="/" replace />
  }

  const AdminRoute = ({ children }) => {
    return authService.isAuthenticated() && authService.isAdmin()
      ? children
      : <Navigate to="/" replace />
  }

  const UserRoute = ({ children }) => {
    return authService.isAuthenticated() && authService.isUser()
      ? children
      : <Navigate to="/" replace />
  }

  const CollaboratorRoute = ({ children }) => {
    return authService.isAuthenticated() && authService.isCollaborator()
      ? children
      : <Navigate to="/" replace />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginMenu />} />
        <Route path="/Admin" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } />
        <Route path="/Users" element={
          <UserRoute>
            <Users />
          </UserRoute>
        } />
        <Route path="/Colab" element={
          <CollaboratorRoute>
            <Colab />
          </CollaboratorRoute>
        } />
      </Routes>
    </Router>
  )
}

export default Routing