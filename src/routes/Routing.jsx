import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import LoginMenu from '../pages/LoginMenu'
import Admin from '../pages/Admin'
import User from '../pages/User'
import { authService } from '../services/AuthServices.jsx'
import Colab from '../pages/Colab'
import Events from '../components/events/Events'
import EventDetail from '../components/events/EventDetail'
import AppLayout from '../components/AppLayout'
import Calendar from '../pages/Calendar'
import AdminUsers from '../pages/AdminUsers'
import AdminCollaborators from '../pages/AdminCollaborators'
import AdminEvents from '../pages/AdminEvents'

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
    return authService.isAuthenticated()
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
        <Route path="/User" element={
          <UserRoute>
            <AppLayout>
              <User />
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

        <Route path="/Events/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <EventDetail />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/AdminUsers" element={
          <AdminRoute>
            <AppLayout>
              <AdminUsers />
            </AppLayout>
          </AdminRoute>
        } />
        <Route path="/AdminCollaborators" element={
          <AdminRoute>
            <AppLayout>
              <AdminCollaborators />
            </AppLayout>
          </AdminRoute>
        } />
        <Route path="/AdminEvents" element={
          <AdminRoute>
            <AppLayout>
              <AdminEvents />
            </AppLayout>
          </AdminRoute>
        } />
      </Routes>
    </Router>
  )
}

export default Routing