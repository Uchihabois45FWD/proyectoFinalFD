import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email, password) {
    try {
      const response = await api.get(`/users`, {
        params: { email, password }
      });
      
      if (response.data.length > 0) {
        const user = response.data[0];
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

  async register(userData) {
    try {
      const existingResponse = await api.get(`/users`, {
        params: { email: userData.email }
      });
      
      if (existingResponse.data.length > 0) {
        return { success: false, message: 'El email ya está registrado' };
      }

      const newUser = {
        ...userData,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      const response = await api.post('/users', newUser);

      if (response.status === 201) {
        const user = response.data;
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

  logout() {
    localStorage.removeItem('authUser');
    return { success: true, message: 'Sesión cerrada' };
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('authUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  isUser() {
    const user = this.getCurrentUser();
    return user && user.role === 'user';
  },

  isCollaborator() {
    const user = this.getCurrentUser();
    return user && user.role === 'colab';
  },

  async updateUser(updatedUser) {
    if (!updatedUser || !updatedUser.id) {
      throw new Error('Usuario inválido para actualizar');
    }
    const res = await api.put(`/users/${updatedUser.id}`, updatedUser);
    const user = res.data;
    localStorage.setItem('authUser', JSON.stringify(user));
    return user;
  }
};