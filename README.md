# Translation Administration System 🌐

Sistema completo de administración de órdenes de traducción con autenticación, gestión de documentos, notificaciones en tiempo real y configuración empresarial.

[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)

## 📋 Índice

- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Instalación Rápida](#-instalación-rápida)
- [Configuración](#️-configuración)
- [Funcionalidades](#-funcionalidades)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Guías](#-guías)
- [Soporte](#-soporte)

## 🚀 Características

### Core Features
- ✅ **Dashboard Completo** - Estadísticas en tiempo real y filtros avanzados
- ✅ **Gestión de Órdenes** - CRUD completo con estados y progreso
- ✅ **Subida de Documentos** - Drag & drop con validación y preview
- ✅ **Sistema de Estados** - Nuevo → En Proceso → Completado → Entregado
- ✅ **Seguimiento de Progreso** - Barra visual y porcentajes

### Enterprise Features
- 🔐 **Autenticación Segura** - Supabase Auth con JWT
- 👥 **Gestión de Perfiles** - Roles, departamentos y avatares
- 🏢 **Configuración Empresarial** - Datos de la empresa personalizables
- 📧 **Sistema SMTP** - Envío automático de emails
- 🔔 **Notificaciones Push** - Centro de notificaciones en tiempo real
- 💾 **Backup Automático** - Respaldos programables y manuales
- 📊 **API REST Completa** - Endpoints para integraciones
- 🌙 **Modo Oscuro** - Tema persistente con transiciones suaves
- 📱 **Diseño Responsivo** - Optimizado para todos los dispositivos

## 🛠️ Tecnologías

| Categoría | Tecnología | Versión | Propósito |
|-----------|------------|---------|-----------|
| **Frontend** | React | 18.3.1 | Framework principal |
| **Language** | TypeScript | 5.5.3 | Tipado estático |
| **Build Tool** | Vite | 5.4.2 | Bundler y dev server |
| **Styling** | Tailwind CSS | 3.4.1 | Framework CSS |
| **Icons** | Lucide React | 0.344.0 | Iconografía |
| **Routing** | React Router | 7.7.1 | Navegación SPA |
| **Backend** | Supabase | 2.52.1 | BaaS completo |
| **Database** | PostgreSQL | - | Base de datos |
| **Auth** | Supabase Auth | - | Autenticación |
| **Storage** | Supabase Storage | - | Almacenamiento |
| **Container** | Docker | - | Containerización |
| **Web Server** | Nginx | - | Servidor web |

## ⚡ Instalación Rápida

### Prerrequisitos
- Node.js 18+ 
- Docker & Docker Compose
- Cuenta en Supabase

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd translation-admin
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env`:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
NODE_ENV=development
```

### 4. Iniciar en desarrollo
```bash
npm run dev
```
🌐 Aplicación disponible en: `http://localhost:6300`

### 5. Deploy con Docker
```bash
npm run docker:compose
```
🚀 Producción disponible en: `http://localhost:6300`

## ⚙️ Configuración

### Supabase Setup

#### 1. Crear Proyecto
1. Ir a [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Obtener URL y clave anónima

#### 2. Configurar Autenticación
```sql
-- En Supabase SQL Editor, las migraciones se aplicarán automáticamente
-- al conectar por primera vez
```

#### 3. Configurar Storage
1. Ir a Storage en Supabase Dashboard
2. Crear bucket: `translated-documents`
3. Configurar políticas públicas de lectura

#### 4. Variables de Entorno
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

# Application Settings
VITE_APP_NAME="Translation Administration System"
VITE_APP_VERSION="1.0.0"
NODE_ENV=production
```

### Docker Configuration

#### docker-compose.yml
```yaml
version: '3.8'
services:
  translation-admin:
    build: .
    ports:
      - "6300:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### Dockerfile
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📊 Funcionalidades

### 1. Dashboard Principal
- **Estadísticas en tiempo real**: Total, nuevas, en proceso, completadas, entregadas
- **Filtros avanzados**: Por estado, búsqueda de texto, rango de fechas
- **Tabla interactiva**: Ordenación, paginación, acciones rápidas
- **Exportación**: CSV, PDF, Excel

### 2. Gestión de Órdenes
```typescript
interface TranslationOrder {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  idioma_origen: string;
  idioma_destino: string;
  status: 'nuevo' | 'en_proceso' | 'completado' | 'entregado';
  tiempo_procesamiento: number;
  progress: number;
  internal_notes: string;
  // ... más campos
}
```

### 3. Sistema de Documentos
- **Upload múltiple**: Drag & drop con validación
- **Tipos soportados**: PDF, DOC, DOCX, TXT
- **Límite de tamaño**: 50MB por archivo
- **Preview**: Visualización antes de subir
- **Descarga**: Enlaces directos seguros

### 4. Centro de Notificaciones
```typescript
interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}
```

### 5. Sistema SMTP
- **Proveedores soportados**: Gmail, Outlook, Custom
- **Configuración segura**: Credenciales encriptadas
- **Test de conexión**: Verificación antes de guardar
- **Templates**: Emails automáticos personalizables

### 6. Backup System
- **Backup manual**: Descarga inmediata en JSON
- **Backup automático**: Programable (horario, diario, semanal, mensual)
- **Contenido**: Órdenes, perfiles, configuraciones, notificaciones
- **Restauración**: Import de backups JSON

## 🔗 API Documentation

### Base URL
```
http://localhost:6300/api
```

### Authentication
Todas las requests requieren header de autorización:
```bash
Authorization: Bearer <supabase_jwt_token>
```

### Endpoints

#### Orders API
```typescript
// GET /api/orders - Obtener todas las órdenes
GET /orders?status=nuevo&limit=10&offset=0

// GET /api/orders/:id - Obtener orden por ID
GET /orders/123e4567-e89b-12d3-a456-426614174000

// POST /api/orders - Crear nueva orden
POST /orders
{
  "nombre": "Juan Pérez",
  "correo": "juan@email.com",
  "telefono": "+1234567890",
  "idioma_origen": "Español",
  "idioma_destino": "Inglés",
  "tiempo_procesamiento": 5
}

// PUT /api/orders/:id - Actualizar orden
PUT /orders/123e4567-e89b-12d3-a456-426614174000
{
  "status": "en_proceso",
  "progress": 50,
  "internal_notes": "Traducción en progreso"
}

// DELETE /api/orders/:id - Eliminar orden
DELETE /orders/123e4567-e89b-12d3-a456-426614174000
```

#### Profile API
```typescript
// GET /api/profile - Obtener perfil del usuario
GET /profile

// PUT /api/profile - Actualizar perfil
PUT /profile
{
  "full_name": "Juan Pérez",
  "phone": "+1234567890",
  "department": "Traducción",
  "role": "translator"
}
```

#### Company API
```typescript
// GET /api/company - Obtener configuración de empresa
GET /company

// PUT /api/company - Actualizar configuración
PUT /company
{
  "company_name": "Translators Inc",
  "company_email": "info@translators.com",
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_user": "noreply@translators.com",
  "smtp_password": "app_password",
  "smtp_secure": true
}
```

#### Notifications API
```typescript
// GET /api/notifications - Obtener notificaciones
GET /notifications?limit=50&unread_only=false

// POST /api/notifications - Crear notificación
POST /notifications
{
  "title": "Nueva orden",
  "message": "Se ha creado una nueva orden de traducción",
  "type": "info",
  "action_url": "/orden/123"
}

// PUT /api/notifications/:id/read - Marcar como leída
PUT /notifications/123/read

// DELETE /api/notifications/:id - Eliminar notificación
DELETE /notifications/123
```

## 🚀 Deployment

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construcción para producción
npm run build

# Preview de producción
npm run preview
```

### Docker - Desarrollo
```bash
# Construir imagen
npm run docker:build

# Ejecutar contenedor
npm run docker:run

# Ver logs
docker logs translation-admin
```

### Docker - Producción
```bash
# Usar Docker Compose
npm run docker:compose

# Verificar servicios
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar servicios
npm run docker:stop
```

### Script de Deploy Automático
```bash
# Hacer ejecutable
chmod +x scripts/deploy.sh

# Ejecutar deploy
./scripts/deploy.sh
```

### Variables de Entorno - Producción
```env
# .env.production
VITE_SUPABASE_URL=https://production.supabase.co
VITE_SUPABASE_ANON_KEY=production_key_here
NODE_ENV=production
VITE_APP_NAME="Translation Admin - Production"
```

## 📚 Guías

### Guía del Usuario

#### 1. Primer Acceso
1. Ir a `http://localhost:6300/login`
2. Hacer clic en "¿No tienes cuenta? Regístrate"
3. Completar email y contraseña
4. Confirmar email si está habilitado
5. Acceder al dashboard

#### 2. Gestión de Órdenes
1. En el dashboard, hacer clic en "Nueva Orden"
2. Completar información del cliente
3. Subir documentos originales
4. Asignar tiempo de procesamiento
5. Guardar orden

#### 3. Procesamiento de Órdenes
1. Hacer clic en "Ver" en cualquier orden
2. Actualizar estado a "En Proceso"
3. Ajustar progreso con el slider
4. Agregar notas internas
5. Subir documentos traducidos
6. Marcar como "Completado"
7. Cambiar a "Entregado" cuando se envíe

#### 4. Configuración de Perfil
1. Ir a "Perfil" en el menú superior
2. Completar información personal
3. Subir avatar (opcional)
4. Seleccionar rol apropiado
5. Guardar cambios

#### 5. Configuración de Empresa
1. Ir a "Empresa" en el menú
2. **Pestaña Información**: Datos de la empresa
3. **Pestaña SMTP**: Configurar envío de emails
4. **Pestaña Backup**: Configurar respaldos automáticos

### Guía del Administrador

#### 1. Configuración SMTP
```bash
# Gmail - Configuración recomendada
SMTP Host: smtp.gmail.com
Puerto: 587
Usuario: tu-email@gmail.com
Contraseña: app-password (no tu contraseña normal)
Seguro: Habilitado (TLS)
```

#### 2. Configuración de Backup
- **Frecuencia recomendada**: Diario
- **Horario sugerido**: 2:00 AM
- **Retención**: Guardar últimos 30 backups
- **Ubicación**: Servidor seguro externo

#### 3. Gestión de Usuarios
```sql
-- Cambiar rol de usuario
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = 'user-uuid-here';

-- Desactivar usuario
UPDATE user_profiles 
SET is_active = false 
WHERE user_id = 'user-uuid-here';
```

#### 4. Monitoreo
- **Logs de aplicación**: `docker-compose logs -f`
- **Métricas de Supabase**: Dashboard de Supabase
- **Notificaciones**: Centro de notificaciones interno

### Guía del Desarrollador

#### 1. Estructura del Proyecto
```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal
│   ├── FileUpload.tsx  # Componente de carga
│   └── ...
├── pages/              # Páginas de la aplicación
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── OrderDetail.tsx # Detalle de orden
│   └── ...
├── contexts/           # Context providers
│   ├── AuthContext.tsx # Autenticación
│   └── ThemeContext.tsx # Tema
├── lib/                # Utilidades y servicios
│   ├── supabase.ts     # Cliente Supabase
│   └── api.ts          # Servicios API
└── App.tsx             # Componente raíz
```

#### 2. Agregar Nueva Función
```typescript
// 1. Crear servicio en lib/api.ts
export class NewFeatureService {
  static async create(data: NewFeature): Promise<NewFeature> {
    const { data: result, error } = await supabase
      .from('new_feature')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }
}

// 2. Crear componente
export function NewFeaturePage() {
  // Implementación del componente
}

// 3. Agregar ruta en App.tsx
<Route path="/new-feature" element={<NewFeaturePage />} />

// 4. Agregar navegación en Layout.tsx
<Link to="/new-feature">Nueva Función</Link>
```

#### 3. Testing
```bash
# Instalar dependencias de test
npm install --save-dev vitest @testing-library/react

# Ejecutar tests
npm run test

# Coverage
npm run test:coverage
```

#### 4. Debugging
```typescript
// Habilitar logs detallados
localStorage.setItem('debug', 'true');

// Ver logs en consola
console.log('Debug info:', data);

// Usar React DevTools
// Instalar extensión de Chrome/Firefox
```

## 🔧 Personalización

### Temas y Estilos
```css
/* Personalizar colores en tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### Configuración de Email Templates
```typescript
// En src/lib/api.ts - SMTPService
const emailTemplate = {
  subject: 'Nueva orden de traducción',
  html: `
    <h1>Hola ${clientName}</h1>
    <p>Tu orden #${orderId} ha sido recibida.</p>
    <p>Estado: ${status}</p>
    <a href="${orderUrl}">Ver orden</a>
  `
};
```

### Webhooks
```typescript
// Agregar webhook endpoint
app.post('/webhook/order-update', async (req, res) => {
  const { orderId, status } = req.body;
  
  // Procesar actualización
  await NotificationService.createNotification({
    title: 'Orden actualizada',
    message: `La orden ${orderId} cambió a ${status}`,
    type: 'info'
  });
  
  res.json({ success: true });
});
```

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a Supabase
```bash
Error: Invalid API key
```
**Solución**: Verificar variables de entorno en `.env`

#### 2. Error de Autenticación
```bash
Error: User not authenticated
```
**Solución**: Limpiar localStorage y volver a iniciar sesión

#### 3. Error de Subida de Archivos
```bash
Error: File too large
```
**Solución**: Verificar límite de tamaño en FileUpload.tsx

#### 4. Error de Docker
```bash
Error: Port 6300 already in use
```
**Solución**: 
```bash
# Parar contenedores existentes
docker-compose down

# Verificar puertos en uso
netstat -an | grep 6300

# Cambiar puerto en docker-compose.yml si es necesario
```

### Logs y Debugging

#### 1. Logs de Aplicación
```bash
# Development
npm run dev # Ver logs en terminal

# Production Docker
docker-compose logs -f translation-admin
```

#### 2. Logs de Supabase
```javascript
// Habilitar logs en desarrollo
const supabase = createClient(url, key, {
  db: { schema: 'public' },
  debug: process.env.NODE_ENV === 'development'
});
```

#### 3. Logs de Nginx
```bash
# Acceder al contenedor
docker exec -it translation-admin-container /bin/sh

# Ver logs de Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 📊 Performance

### Optimizaciones Implementadas
- **Code Splitting**: Carga lazy de componentes
- **Image Optimization**: Compresión automática
- **Caching**: Headers de cache en Nginx
- **Gzip**: Compresión de assets
- **Tree Shaking**: Eliminación de código no usado

### Métricas de Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

### Monitoreo
```javascript
// Performance monitoring
window.addEventListener('load', () => {
  const loadTime = performance.now();
  console.log(`Page loaded in ${loadTime}ms`);
});
```

## 🔒 Seguridad

### Medidas Implementadas
- **HTTPS Only**: Forzar conexiones seguras
- **JWT Tokens**: Autenticación stateless
- **CORS**: Configuración restrictiva
- **Headers de Seguridad**: CSP, HSTS, X-Frame-Options
- **Sanitización**: Input sanitization
- **Rate Limiting**: Limitación de requests

### Security Headers (Nginx)
```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'";
```

### Recomendaciones
1. **Rotación de Claves**: Cambiar claves API periódicamente
2. **Backups Seguros**: Encriptar backups sensibles
3. **Auditoría**: Revisar logs regularmente
4. **Updates**: Mantener dependencias actualizadas

## 📈 Roadmap

### Versión 1.1.0
- [ ] **Multi-idioma (i18n)**: Soporte para múltiples idiomas
- [ ] **Reportes Avanzados**: Gráficos y estadísticas detalladas
- [ ] **API v2**: Endpoints GraphQL
- [ ] **Mobile App**: React Native companion

### Versión 1.2.0
- [ ] **Integración con CAT Tools**: Trados, MemoQ
- [ ] **Machine Translation**: Google Translate, DeepL
- [ ] **Time Tracking**: Seguimiento de tiempo por proyecto
- [ ] **Facturación**: Sistema de billing integrado

### Versión 2.0.0
- [ ] **Multi-tenancy**: Soporte para múltiples empresas
- [ ] **Workflow Engine**: Flujos de trabajo personalizables
- [ ] **Advanced Analytics**: BI dashboard
- [ ] **Marketplace**: Directorio de traductores

## 📞 Soporte

### Recursos de Ayuda
- **Documentación**: Este README y docs/
- **Issues**: GitHub Issues para bugs
- **Discussions**: GitHub Discussions para preguntas
- **Wiki**: Documentación extendida en Wiki

### Reportar Bugs
1. Usar el template de issue
2. Incluir pasos para reproducir
3. Agregar screenshots si es relevante
4. Especificar entorno (OS, browser, versión)

### Feature Requests
1. Describir caso de uso
2. Explicar beneficio esperado
3. Proporcionar mockups si es posible
4. Marcar con label "enhancement"

### Contacto
- **Email**: support@translation-admin.com
- **Twitter**: @TranslationAdmin
- **LinkedIn**: Translation Administration System

## 🤝 Contribuir

### Getting Started
1. Fork el repositorio
2. Crear branch: `git checkout -b feature/nueva-funcion`
3. Commit cambios: `git commit -am 'Add nueva función'`
4. Push branch: `git push origin feature/nueva-funcion`
5. Crear Pull Request

### Coding Standards
- **TypeScript**: Usar tipos explícitos
- **ESLint**: Seguir reglas configuradas
- **Prettier**: Formateo automático
- **Commits**: Usar conventional commits

### Testing
```bash
# Ejecutar todos los tests
npm test

# Test específico
npm test -- --grep "OrderService"

# Coverage
npm run test:coverage
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Translation Administration System v1.0.0**  
Desarrollado con ❤️ usando React, TypeScript y Supabase

© 2024 Translation Administration System. Todos los derechos reservados.