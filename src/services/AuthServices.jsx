import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Puerto de json-server

// Configurar axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const authService = {
  // Login - buscar usuario por email y password
  async login(email, password) {
    try {
      const response = await api.get(`/users`, {
        params: { email, password }
      });
      
      if (response.data.length > 0) {
        const user = response.data[0];
        // Guardar en localStorage
        localStorage.setItem('authUser', JSON.stringify(user));
        return { success: true, user, message: 'Login exitoso' };
      } else {
        return { success: false, message: 'Credenciales incorrectas' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      if (error.code === 'ECONNREFUSED') {
        return { success: false, message: 'No se pudo conectar al servidor' };
      }
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Registro - crear nuevo usuario
  async register(userData) {
    try {
      // Verificar si el email ya existe
      const existingResponse = await api.get(`/users`, {
        params: { email: userData.email }
      });
      
      if (existingResponse.data.length > 0) {
        return { success: false, message: 'El email ya está registrado' };
      }

      // Crear nuevo usuario (siempre con role "user" por defecto)
      const newUser = {
        ...userData,
        role: 'user', // Los nuevos usuarios son siempre usuarios normales
        createdAt: new Date().toISOString()
      };

      const response = await api.post('/users', newUser);

      if (response.status === 201) {
        const user = response.data;
        // Guardar en localStorage
        localStorage.setItem('authUser', JSON.stringify(user));
        return { success: true, user, message: 'Registro exitoso' };
      } else {
        return { success: false, message: 'Error al crear la cuenta' };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      if (error.code === 'ECONNREFUSED') {
        return { success: false, message: 'No se pudo conectar al servidor' };
      }
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('authUser');
    return { success: true, message: 'Sesión cerrada' };
  },

  // Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('authUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  // Verificar si es admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  isUser() {
    const user = this.getCurrentUser();
    return user && user.role === 'user';
  },

  // Ajusta los correos permitidos según necesidad
  isCollaborator() {
    const user = this.getCurrentUser();
    if (!user || !user.email) return false;
    const allowedCollaborators = [
      'sweetspotCR@gmail.com'
    ];
    return allowedCollaborators.includes(String(user.email).toLowerCase());
  }
};