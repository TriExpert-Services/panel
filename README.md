# Translation Administration System

Sistema de administración de órdenes de traducción con autenticación segura y panel de control completo.

## 🚀 Características

- ✅ **Autenticación segura** con Supabase Auth
- 📊 **Dashboard completo** con estadísticas y filtros
- 📄 **Gestión de documentos** con carga y descarga
- 🌙 **Modo oscuro** con persistencia
- 📱 **Diseño responsivo** para todos los dispositivos
- 🔒 **Rutas protegidas** con redirección automática
- 🐳 **Configuración Docker** para producción

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Almacenamiento**: Supabase Storage
- **Iconos**: Lucide React
- **Deployment**: Docker + Nginx

## 🏗️ Instalación

### Desarrollo Local

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd translation-admin
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita `.env` con tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:6300`

### Producción con Docker

1. **Construir la imagen**
   ```bash
   npm run docker:build
   ```

2. **Ejecutar con Docker**
   ```bash
   npm run docker:run
   ```

3. **O usar Docker Compose**
   ```bash
   npm run docker:compose
   ```

La aplicación estará disponible en `http://localhost:6300`

## 📋 Configuración de Supabase

### 1. Crear proyecto en Supabase
- Ve a [supabase.com](https://supabase.com)
- Crea un nuevo proyecto
- Obtén tu URL y clave anónima

### 2. Configurar autenticación
- En tu proyecto de Supabase, ve a Authentication > Settings
- Configura los proveedores de autenticación que desees
- Habilita "Email confirmations" si lo necesitas

### 3. Ejecutar migraciones
Las migraciones se ejecutan automáticamente cuando conectas a Supabase.

### 4. Configurar almacenamiento
- Ve a Storage en tu dashboard de Supabase
- Crea un bucket llamado `translated-documents`
- Configura las políticas de acceso según tus necesidades

## 🔒 Autenticación

El sistema incluye:
- **Registro de usuarios** con email y contraseña
- **Inicio de sesión** seguro
- **Rutas protegidas** que requieren autenticación
- **Cierre de sesión** con limpieza de estado
- **Verificación automática** de sesión al cargar la app

### Cuentas por defecto
Para crear la primera cuenta administrativa:
1. Ve a `/login`
2. Haz clic en "¿No tienes cuenta? Regístrate"
3. Crea tu cuenta con email y contraseña
4. La cuenta se registrará automáticamente en Supabase

## 📱 Funcionalidades

### Dashboard
- Estadísticas en tiempo real
- Filtros por estado y texto
- Tabla interactiva con paginación
- Acciones rápidas (ver, eliminar)

### Gestión de Órdenes
- Visualización detallada de cada orden
- Actualización de estado y progreso
- Notas internas para el equipo
- Historial de cambios

### Gestión de Documentos
- Carga de documentos originales
- Descarga de archivos
- Subida de documentos traducidos
- Previsualización de archivos

## 🎨 Personalización

### Temas
- Modo claro y oscuro
- Persistencia de preferencias
- Transiciones suaves
- Colores adaptativos

### Responsive Design
- Mobile-first approach
- Breakpoints optimizados
- Navegación adaptable
- UX consistente

## 🚀 Deployment

### Variables de Entorno para Producción
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
NODE_ENV=production
```

### Docker Commands
```bash
# Construcción
docker build -t translation-admin .

# Ejecución
docker run -p 3000:80 translation-admin

# Con Docker Compose
docker-compose up -d

# Parar servicios
docker-compose down
```

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run preview` - Preview de la build
- `npm run lint` - Linting del código
- `npm run docker:build` - Construcción de imagen Docker
- `npm run docker:run` - Ejecución con Docker
- `npm run docker:compose` - Ejecución con Docker Compose

## 🛡️ Seguridad

- Autenticación basada en JWT
- Rutas protegidas del lado del cliente
- Validación de datos en el frontend
- Headers de seguridad en Nginx
- Variables de entorno protegidas

## 📞 Soporte

Para reportar bugs o solicitar características:
1. Abre un issue en el repositorio
2. Incluye pasos para reproducir el problema
3. Especifica tu entorno (OS, navegador, versión)

## 📄 Licencia

Este proyecto está bajo la licencia MIT.