# Guía de Instalación 🚀

Guía completa para instalar y configurar el Translation Administration System.

## Tabla de Contenidos

- [Prerrequisitos](#prerrequisitos)
- [Instalación Local](#instalación-local)
- [Configuración de Supabase](#configuración-de-supabase)
- [Instalación con Docker](#instalación-con-docker)
- [Configuración de Producción](#configuración-de-producción)
- [Verificación](#verificación)
- [Troubleshooting](#troubleshooting)

## Prerrequisitos

### Software Requerido

| Software | Versión Mínima | Propósito |
|----------|----------------|-----------|
| Node.js | 18.0.0+ | Runtime de JavaScript |
| npm | 9.0.0+ | Gestor de paquetes |
| Docker | 20.0.0+ | Containerización |
| Docker Compose | 2.0.0+ | Orquestación de contenedores |
| Git | 2.30.0+ | Control de versiones |

### Verificar Prerrequisitos

```bash
# Verificar Node.js
node --version
# Esperado: v18.x.x o superior

# Verificar npm
npm --version
# Esperado: 9.x.x o superior

# Verificar Docker
docker --version
# Esperado: Docker version 20.x.x o superior

# Verificar Docker Compose
docker compose version
# Esperado: Docker Compose version v2.x.x o superior

# Verificar Git
git --version
# Esperado: git version 2.30.x o superior
```

### Cuentas Necesarias

1. **Cuenta en Supabase**: [https://supabase.com](https://supabase.com)
2. **Proveedor SMTP** (opcional): Gmail, Outlook, SendGrid, etc.

## Instalación Local

### 1. Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/your-org/translation-admin.git

# Navegar al directorio
cd translation-admin

# Verificar archivos
ls -la
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias de producción y desarrollo
npm install

# Verificar instalación
npm list --depth=0
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar archivo .env
nano .env
```

**Configuración mínima en `.env`:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui

# Application Settings
VITE_APP_NAME="Translation Administration System"
VITE_APP_VERSION="1.0.0"
NODE_ENV=development
```

### 4. Ejecutar en Modo Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en:
# http://localhost:6300
```

## Configuración de Supabase

### 1. Crear Proyecto en Supabase

1. Ir a [https://supabase.com](https://supabase.com)
2. Hacer clic en "Start your project"
3. Crear una cuenta o iniciar sesión
4. Hacer clic en "New Project"
5. Completar:
   - **Name**: `translation-admin`
   - **Database Password**: Usar contraseña segura
   - **Region**: Seleccionar región más cercana
6. Hacer clic en "Create new project"
7. Esperar 2-3 minutos para que se complete la creación

### 2. Obtener Credenciales

1. En el dashboard de tu proyecto, ir a **Settings** → **API**
2. Copiar:
   - **Project URL**: `https://xyzabc123.supabase.co`
   - **anon public**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...`

### 3. Configurar Autenticación

1. Ir a **Authentication** → **Settings**
2. En **Site URL**, agregar: `http://localhost:6300`
3. En **Redirect URLs**, agregar: `http://localhost:6300/**`
4. **Email Auth**: Dejar habilitado
5. **Email Confirmations**: Deshabilitar para desarrollo (opcional)

### 4. Configurar Base de Datos

Las migraciones se ejecutarán automáticamente al conectar por primera vez. Incluyen:

- Tabla `solicitudes_traduccion` para órdenes
- Tabla `user_profiles` para perfiles de usuario
- Tabla `company_settings` para configuración
- Tabla `notifications` para notificaciones
- Políticas RLS (Row Level Security)
- Datos de ejemplo

### 5. Configurar Storage

1. Ir a **Storage** en el dashboard
2. Hacer clic en "Create bucket"
3. Configurar:
   - **Name**: `translated-documents`
   - **Public bucket**: ✅ Habilitado
4. Hacer clic en "Create bucket"

### 6. Configurar Políticas de Storage

```sql
-- En SQL Editor, ejecutar:

-- Política para leer archivos públicos
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'translated-documents');

-- Política para subir archivos (usuarios autenticados)
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'translated-documents' AND auth.role() = 'authenticated');

-- Política para actualizar archivos
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (bucket_id = 'translated-documents' AND auth.role() = 'authenticated');
```

### 7. Actualizar Variables de Entorno

```env
# Actualizar .env con tus credenciales reales
VITE_SUPABASE_URL=https://tu-proyecto-real.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_real
```

## Instalación con Docker

### 1. Opción Rápida con Docker Compose

```bash
# Construir y ejecutar
npm run docker:compose

# Verificar que esté ejecutándose
docker compose ps

# Ver logs
docker compose logs -f
```

### 2. Opción Manual con Docker

```bash
# Construir imagen
npm run docker:build

# Ejecutar contenedor
npm run docker:run

# Verificar contenedor
docker ps
```

### 3. Dockerfile Personalizado

Si necesitas modificar la configuración de Docker:

```dockerfile
# Dockerfile personalizado
FROM node:18-alpine as builder

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
```

### 4. Docker Compose Personalizado

```yaml
# docker-compose.override.yml
version: '3.8'

services:
  translation-admin:
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    volumes:
      - ./uploads:/app/uploads
    networks:
      - translation-network

  # Agregar base de datos local (opcional)
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: translation_admin
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:

networks:
  translation-network:
    driver: bridge
```

## Configuración de Producción

### 1. Variables de Entorno de Producción

```env
# .env.production
VITE_SUPABASE_URL=https://tu-proyecto-prod.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_prod
NODE_ENV=production
VITE_APP_NAME="Translation Admin - Production"

# Configuración adicional
VITE_API_TIMEOUT=30000
VITE_MAX_FILE_SIZE=52428800
VITE_ALLOWED_FILE_TYPES=pdf,doc,docx,txt
```

### 2. Configuración de Nginx

```nginx
# nginx.conf para producción
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';";

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        # Security - hide server info
        server_tokens off;

        # Upload size limit
        client_max_body_size 50M;

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 3. SSL/HTTPS con Let's Encrypt

```bash
# Instalar Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. Script de Deploy Automático

```bash
#!/bin/bash
# scripts/deploy-production.sh

set -e

echo "🚀 Starting production deployment..."

# 1. Verificar prerrequisitos
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    exit 1
fi

# 2. Backup de la base de datos
echo "💾 Creating database backup..."
npm run backup:create

# 3. Construir aplicación
echo "📦 Building application..."
NODE_ENV=production npm run build

# 4. Construir imagen Docker
echo "🐳 Building Docker image..."
docker build -t translation-admin:latest .

# 5. Parar servicios anteriores
echo "⏹️ Stopping previous services..."
docker compose -f docker-compose.prod.yml down

# 6. Iniciar nuevos servicios
echo "▶️ Starting new services..."
docker compose -f docker-compose.prod.yml up -d

# 7. Verificar salud
echo "🔍 Checking application health..."
sleep 10
curl -f http://localhost:6300/health || exit 1

echo "✅ Deployment completed successfully!"
echo "🌐 Application is running at http://localhost:6300"
```

### 5. Monitoreo y Logs

```bash
# Ver logs en tiempo real
docker compose logs -f translation-admin

# Ver métricas del contenedor
docker stats translation-admin

# Backup automático
crontab -e
# Agregar: 0 2 * * * cd /path/to/app && npm run backup:create
```

## Verificación

### 1. Verificar Instalación Local

```bash
# 1. Verificar que el servidor esté ejecutándose
curl http://localhost:6300

# 2. Verificar página de login
curl http://localhost:6300/login

# 3. Verificar conexión a Supabase
# En la consola del navegador (F12):
# Debe mostrar conexión exitosa sin errores
```

### 2. Verificar Docker

```bash
# 1. Verificar contenedor
docker ps | grep translation-admin

# 2. Verificar logs
docker logs translation-admin

# 3. Verificar aplicación
curl http://localhost:6300
```

### 3. Tests de Funcionalidad

```bash
# Ejecutar tests unitarios
npm test

# Tests de integración
npm run test:integration

# Tests e2e (si están configurados)
npm run test:e2e
```

### 4. Verificar Base de Datos

```sql
-- En Supabase SQL Editor
SELECT 
  schemaname,
  tablename,
  rowcount 
FROM 
  pg_stat_user_tables 
WHERE 
  tablename IN ('solicitudes_traduccion', 'user_profiles', 'company_settings', 'notifications');
```

## Troubleshooting

### Problemas Comunes

#### 1. Error de Puerto en Uso

```bash
Error: Port 6300 already in use
```

**Solución:**
```bash
# Encontrar proceso usando el puerto
lsof -i :6300

# Matar proceso
kill -9 <PID>

# O cambiar puerto en vite.config.ts
export default defineConfig({
  server: {
    port: 6301, // Cambiar puerto
  },
});
```

#### 2. Error de Conexión a Supabase

```bash
Error: Invalid API URL or key
```

**Solución:**
```bash
# 1. Verificar variables de entorno
cat .env

# 2. Verificar formato de URL (debe incluir https://)
VITE_SUPABASE_URL=https://xyzabc123.supabase.co

# 3. Verificar que la clave sea la 'anon public', no la 'service_role'
```

#### 3. Error de Permisos en Docker

```bash
Error: Permission denied
```

**Solución:**
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar
newgrp docker

# Verificar permisos
docker run hello-world
```

#### 4. Error de Dependencias

```bash
Error: Cannot resolve dependency
```

**Solución:**
```bash
# Limpiar cache
npm cache clean --force

# Eliminar node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

#### 5. Error de Migraciones

```bash
Error: Migration failed
```

**Solución:**
```bash
# 1. Verificar conexión a Supabase
# 2. En Supabase SQL Editor, ejecutar manualmente:

-- Verificar tablas existentes
\dt

-- Ejecutar migraciones manualmente si es necesario
-- (Copiar contenido de archivos .sql en supabase/migrations/)
```

### Logs de Debugging

#### 1. Habilitar Logs Detallados

```typescript
// En src/lib/supabase.ts
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  debug: process.env.NODE_ENV === 'development'
});
```

#### 2. Ver Logs en Consola

```javascript
// En consola del navegador (F12)
localStorage.setItem('debug', 'true');
// Recargar página para ver logs detallados
```

#### 3. Logs de Docker

```bash
# Ver todos los logs
docker compose logs

# Ver logs específicos
docker compose logs translation-admin

# Seguir logs en tiempo real
docker compose logs -f
```

### Solicitar Ayuda

Si los problemas persisten:

1. **Revisar logs**: Compartir logs completos del error
2. **Versiones**: Compartir versiones de Node.js, npm, Docker
3. **Configuración**: Verificar archivo .env (sin compartir claves)
4. **Sistema**: Especificar OS y versión

```bash
# Información del sistema para soporte
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Docker: $(docker --version)"
echo "OS: $(uname -a)"
```

¡Con esto deberías tener el sistema funcionando completamente! 🎉