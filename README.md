# Proyecto Final FD - Sistema de Gestión de Eventos

## 📋 Descripción

Este proyecto es un sistema completo de gestión de eventos desarrollado con React y Vite. Permite a los usuarios crear, gestionar y participar en eventos de manera organizada, con un sistema de roles que incluye administradores, colaboradores y usuarios regulares. El sistema incluye funcionalidades de autenticación, gestión de eventos, calendario interactivo y paneles de administración.

## ✨ Características Principales

### 👤 Gestión de Usuarios
- **Autenticación completa**: Login y registro de usuarios
- **Sistema de roles**: Administrador, Colaborador y Usuario
- **Perfiles personalizados**: Información detallada de usuarios con fotos

### 📅 Gestión de Eventos
- **Creación de eventos**: Formularios completos para crear eventos
- **Aprobación de eventos**: Sistema de revisión para administradores
- **Vista detallada**: Información completa de cada evento
- **Calendario interactivo**: Visualización de eventos en calendario

### 🛠️ Paneles de Administración
- **Gestión de usuarios**: Ver, editar y eliminar usuarios
- **Gestión de colaboradores**: Administración de colaboradores
- **Gestión de eventos**: Aprobar, rechazar y gestionar eventos
- **Estadísticas**: Panel con métricas del sistema

### 🎨 Interfaz de Usuario
- **Diseño responsivo**: Adaptable a diferentes dispositivos
- **Fondos dinámicos**: Fondos personalizados por sección
- **Navegación intuitiva**: Barra de navegación clara
- **Componentes reutilizables**: Arquitectura modular

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19**: Framework principal
- **Vite**: Herramienta de construcción rápida
- **React Router DOM**: Navegación y rutas
- **Axios**: Cliente HTTP para API

### UI/UX
- **CSS3**: Estilos personalizados
- **Lucide React**: Iconos modernos
- **Leaflet**: Mapas interactivos
- **React Calendar**: Componente de calendario

### Backend (Simulado)
- **JSON Server**: API REST simulada
- **Base de datos JSON**: Almacenamiento local

### Desarrollo
- **ESLint**: Linting y calidad de código
- **date-fns**: Manipulación de fechas

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd proyectofinalfd
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Inicia el servidor JSON (en otra terminal)**
   ```bash
   npm run server
   ```

5. **Accede a la aplicación**
   - Frontend: http://localhost:5173
   - API: http://localhost:3001

## 📖 Uso de la Aplicación

### Credenciales de Prueba

#### Administrador
- **Email**: admin@sistema.com
- **Contraseña**: admin123

#### Colaborador
- **Email**: sweetspotCR@gmail.com
- **Contraseña**: Colab!2025

#### Usuario Regular
- **Email**: pepe@gmail.com
- **Contraseña**: 123456

### Navegación por Roles

#### 👑 Administrador
- **Panel principal**: `/Admin` - Vista general con estadísticas
- **Gestión de usuarios**: `/AdminUsers` - Administrar usuarios del sistema
- **Gestión de colaboradores**: `/AdminCollaborators` - Gestionar colaboradores
- **Gestión de eventos**: `/AdminEvents` - Aprobar y gestionar eventos

#### 🤝 Colaborador
- **Panel principal**: `/Colab` - Vista específica para colaboradores
- **Eventos**: `/Events` - Ver y gestionar eventos asignados

#### 👤 Usuario
- **Perfil**: `/User` - Gestionar perfil personal
- **Calendario**: `/Calendar` - Ver eventos en calendario
- **Eventos**: `/Events` - Explorar y participar en eventos

## 📁 Estructura del Proyecto

```
proyectofinalfd/
├── public/                 # Archivos estáticos
│   ├── *.png              # Imágenes del proyecto
│   └── ...
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── Admin/        # Componentes específicos de admin
│   │   ├── events/       # Componentes relacionados con eventos
│   │   └── ...
│   ├── pages/            # Páginas principales
│   │   ├── Admin.jsx     # Panel de administración
│   │   ├── User.jsx      # Perfil de usuario
│   │   └── ...
│   ├── routes/           # Configuración de rutas
│   ├── services/         # Servicios y API calls
│   ├── styles/           # Archivos CSS
│   │   ├── admin/        # Estilos de administración
│   │   ├── events/       # Estilos de eventos
│   │   └── ...
│   ├── App.jsx           # Componente raíz
│   └── main.jsx          # Punto de entrada
├── db.json               # Base de datos simulada
├── package.json          # Dependencias y scripts
└── vite.config.js        # Configuración de Vite
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run server       # Inicia JSON Server en puerto 3001

# Construcción
npm run build        # Construye para producción
npm run preview      # Vista previa de la build

# Calidad de código
npm run lint         # Ejecuta ESLint
```

## 🔌 API Endpoints

La aplicación utiliza JSON Server para simular una API REST. Los endpoints principales son:

### Usuarios
- `GET /users` - Obtener todos los usuarios
- `POST /users` - Crear nuevo usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Eventos
- `GET /events` - Obtener todos los eventos
- `POST /events` - Crear nuevo evento
- `PUT /events/:id` - Actualizar evento
- `DELETE /events/:id` - Eliminar evento

## 🎯 Funcionalidades Destacadas

### Sistema de Autenticación
- Login seguro con validación de roles
- Protección de rutas basada en autenticación
- Persistencia de sesión

### Gestión de Eventos
- Creación con formulario completo
- Sistema de aprobación/rechazo
- Ubicaciones con mapas (Leaflet)
- Categorización y formatos

### Interfaz Moderna
- Diseño responsivo
- Animaciones y transiciones
- Iconografía consistente
- Fondos temáticos por sección

## 🤝 Contribución

Este proyecto fue desarrollado como trabajo final para el curso de Fundamentos de Desarrollo. Para contribuciones:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de uso educativo y no cuenta con una licencia específica.

## 👥 Desarrollador

Proyecto desarrollado como parte del curso de Fundamentos de Desarrollo.

---

**Nota**: Asegúrate de tener ambos servidores corriendo (frontend y JSON Server) para el funcionamiento completo de la aplicación.
