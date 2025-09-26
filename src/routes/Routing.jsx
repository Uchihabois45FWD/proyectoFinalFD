import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import LoginMenu from '../pages/LoginMenu'
import Admin from '../pages/Admin'
import Users from '../pages/Users'
import { authService } from '../services/AuthServices'
import Colab from '../pages/colab'
import Events from '../components/events/Events'
import ApprovedEvents from '../components/events/ApprovedEvents'
import EventDetail from '../components/events/EventDetail'
import AppLayout from '../components/AppLayout'
import Calendar from '../pages/Calendar'

function Routing() {
  const ProtectedRoute = ({ children }) => {
    return authService.isAuthenticated() ? children : <Navigate to="/" replace />
  }

  const AdminRoute = ({ children }) => {
    return authService.isAuthenticated() && authService.isAdmin()
      ? children
      : <Navigate to="/" replace />
  }

  const UserRoute = ({ children }) => {
    return authService.isAuthenticated() && (authService.isUser() || authService.isCollaborator())
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
            <AppLayout>
              <Admin />
            </AppLayout>
          </AdminRoute>
        } />
        <Route path="/Users" element={
          <UserRoute>
            <AppLayout>
              <Users />
            </AppLayout>
          </UserRoute>
        } />
        <Route path="/Calendar" element={
          <UserRoute>
            <AppLayout>
              <Calendar />
            </AppLayout>
          </UserRoute>
        } />
        <Route path="/Colab" element={
          <CollaboratorRoute>
            <AppLayout>
              <Colab />
            </AppLayout>
          </CollaboratorRoute>
        } />
        <Route path="/Events" element={
          <ProtectedRoute>
            <AppLayout>
              <Events />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/Approved-Events" element={
          <AdminRoute>
            <AppLayout>
              <ApprovedEvents />
            </AppLayout>
          </AdminRoute>
        } />
        <Route path="/Events/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <EventDetail />
            </AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default Routing