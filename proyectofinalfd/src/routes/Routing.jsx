/**
 * Componente de rutas principales de la aplicación.
 * Define rutas públicas y protegidas con control de acceso basado en roles.
 * Utiliza react-router-dom para la navegación y protección de rutas.
 */
import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import LoginMenu from '../pages/LoginMenu' // Página de login/registro
import Admin from '../pages/Admin' // Panel principal del administrador
import User from '../pages/User' // Perfil y gestión del usuario
import { authService } from '../services/AuthServices.jsx' // Servicio de autenticación
import Colab from '../pages/Colab' // Panel del colaborador
import Events from '../components/events/Events' // Gestión de eventos
import EventDetail from '../components/events/EventDetail' // Vista detallada de evento
import AppLayout from '../components/AppLayout' // Layout común con navbar
import Calendar from '../pages/Calendar' // Calendario de eventos
import AdminUsers from '../pages/AdminUsers' // Gestión de usuarios por admin
import AdminCollaborators from '../pages/AdminCollaborators' // Gestión de colaboradores
import AdminEvents from '../pages/AdminEvents' // Gestión de eventos por admin
import PageBackground from '../components/PageBackground' // Componente de fondo dinámico

function Routing() {
  // Ruta protegida - requiere autenticación
  const ProtectedRoute = ({ children }) => {
    return authService.isAuthenticated() ? children : <Navigate to="/" replace />
  }

  // Ruta protegida para administradores - requiere rol admin
  const AdminRoute = ({ children }) => {
    return authService.isAuthenticated() && authService.isAdmin()
      ? children
      : <Navigate to="/" replace />
  }

  // Ruta protegida para usuarios autenticados
  const UserRoute = ({ children }) => {
    return authService.isAuthenticated()
      ? children
      : <Navigate to="/" replace />
  }

  // Ruta protegida para colaboradores - requiere rol colaborador
  const CollaboratorRoute = ({ children }) => {
    return authService.isAuthenticated() && authService.isCollaborator()
      ? children
      : <Navigate to="/" replace />
  }

  return (
    <Router>
      <Routes>
        {/* Ruta pública - Página de login */}
        <Route path="/" element={
          <PageBackground backgroundClass="login-bg">
            <LoginMenu />
          </PageBackground>
        } />

        {/* Ruta administrativa - Panel de administración */}
        <Route path="/Admin" element={
          <AdminRoute>
            <PageBackground backgroundClass="admin-bg">
              <AppLayout>
                <Admin />
              </AppLayout>
            </PageBackground>
          </AdminRoute>
        } />

        {/* Ruta de usuario - Perfil de usuario */}
        <Route path="/User" element={
          <UserRoute>
            <PageBackground backgroundClass="user-bg">
              <AppLayout>
                <User />
              </AppLayout>
            </PageBackground>
          </UserRoute>
        } />

        {/* Ruta de calendario - Visualización de eventos en calendario */}
        <Route path="/Calendar" element={
          <UserRoute>
            <PageBackground backgroundClass="calendar-bg">
              <AppLayout>
                <Calendar />
              </AppLayout>
            </PageBackground>
          </UserRoute>
        } />

        {/* Ruta de colaborador - Panel de colaborador */}
        <Route path="/Colab" element={
          <CollaboratorRoute>
            <PageBackground backgroundClass="colab-bg">
              <AppLayout>
                <Colab />
              </AppLayout>
            </PageBackground>
          </CollaboratorRoute>
        } />

        {/* Ruta de eventos - Gestión y visualización de eventos */}
        <Route path="/Events" element={
          <ProtectedRoute>
            <PageBackground backgroundClass="events-bg">
              <AppLayout>
                <Events />
              </AppLayout>
            </PageBackground>
          </ProtectedRoute>
        } />

        {/* Ruta de detalle de evento - Vista detallada de un evento específico */}
        <Route path="/Events/:id" element={
          <ProtectedRoute>
            <PageBackground backgroundClass="events-bg">
              <AppLayout>
                <EventDetail />
              </AppLayout>
            </PageBackground>
          </ProtectedRoute>
        } />

        {/* Ruta administrativa - Gestión de usuarios */}
        <Route path="/AdminUsers" element={
          <AdminRoute>
            <PageBackground backgroundClass="admin-bg">
              <AppLayout>
                <AdminUsers />
              </AppLayout>
            </PageBackground>
          </AdminRoute>
        } />

        {/* Ruta administrativa - Gestión de colaboradores */}
        <Route path="/AdminCollaborators" element={
          <AdminRoute>
            <PageBackground backgroundClass="admin-bg">
              <AppLayout>
                <AdminCollaborators />
              </AppLayout>
            </PageBackground>
          </AdminRoute>
        } />

        {/* Ruta administrativa - Gestión de eventos */}
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
