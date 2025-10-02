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
import PageBackground from '../components/PageBackground'

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
        <Route path="/" element={
          <PageBackground backgroundClass="login-bg">
            <LoginMenu />
          </PageBackground>
        } />
        
        <Route path="/Admin" element={
          <AdminRoute>
            <PageBackground backgroundClass="admin-bg">
              <AppLayout>
                <Admin />
              </AppLayout>
            </PageBackground>
          </AdminRoute>
        } />
        
        <Route path="/User" element={
          <UserRoute>
            <PageBackground backgroundClass="user-bg">
              <AppLayout>
                <User />
              </AppLayout>
            </PageBackground>
          </UserRoute>
        } />
        
        <Route path="/Calendar" element={
          <UserRoute>
            <PageBackground backgroundClass="calendar-bg">
              <AppLayout>
                <Calendar />
              </AppLayout>
            </PageBackground>
          </UserRoute>
        } />
        
        <Route path="/Colab" element={
          <CollaboratorRoute>
            <PageBackground backgroundClass="colab-bg">
              <AppLayout>
                <Colab />
              </AppLayout>
            </PageBackground>
          </CollaboratorRoute>
        } />
        
        <Route path="/Events" element={
          <ProtectedRoute>
            <PageBackground backgroundClass="events-bg">
              <AppLayout>
                <Events />
              </AppLayout>
            </PageBackground>
          </ProtectedRoute>
        } />

        <Route path="/Events/:id" element={
          <ProtectedRoute>
            <PageBackground backgroundClass="events-bg">
              <AppLayout>
                <EventDetail />
              </AppLayout>
            </PageBackground>
          </ProtectedRoute>
        } />
        
        <Route path="/AdminUsers" element={
          <AdminRoute>
            <PageBackground backgroundClass="admin-bg">
              <AppLayout>
                <AdminUsers />
              </AppLayout>
            </PageBackground>
          </AdminRoute>
        } />
        
        <Route path="/AdminCollaborators" element={
          <AdminRoute>
            <PageBackground backgroundClass="admin-bg">
              <AppLayout>
                <AdminCollaborators />
              </AppLayout>
            </PageBackground>
          </AdminRoute>
        } />
        
        <Route path="/AdminEvents" element={
          <AdminRoute>
            <PageBackground backgroundClass="admin-bg">
              <AppLayout>
                <AdminEvents />
              </AppLayout>
            </PageBackground>
          </AdminRoute>
        } />
      </Routes>
    </Router>
  )
}

export default Routing