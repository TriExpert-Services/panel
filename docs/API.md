# API Documentation 🔗

Documentación completa de la API REST del Translation Administration System.

## Base URL
```
http://localhost:6300/api
```

## Autenticación

Todas las requests requieren autenticación mediante JWT token:

```http
Authorization: Bearer <supabase_jwt_token>
```

## Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | OK - Request exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Request inválida |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

## Endpoints

### 🔐 Authentication

#### POST /auth/register
Registrar nuevo usuario.

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña123",
  "full_name": "Nombre Completo"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": 1640995200
  }
}
```

#### POST /auth/login
Iniciar sesión.

**Request:**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@email.com"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": 1640995200
  }
}
```

#### POST /auth/logout
Cerrar sesión.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### 📋 Orders (Órdenes de Traducción)

#### GET /orders
Obtener todas las órdenes de traducción.

**Query Parameters:**
- `status` (string): Filtrar por estado (`nuevo`, `en_proceso`, `completado`, `entregado`)
- `search` (string): Búsqueda por texto
- `limit` (number): Límite de resultados (default: 50)
- `offset` (number): Offset para paginación (default: 0)
- `sort` (string): Campo para ordenar (default: `fecha_solicitud`)
- `order` (string): Dirección de ordenamiento (`asc`, `desc`)

**Example Request:**
```http
GET /orders?status=en_proceso&limit=10&offset=0&sort=fecha_solicitud&order=desc
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "correo": "juan@email.com",
      "telefono": "+1234567890",
      "idioma_origen": "Español",
      "idioma_destino": "Inglés",
      "status": "en_proceso",
      "tiempo_procesamiento": 5,
      "progress": 75,
      "internal_notes": "Traducción avanzada",
      "fecha_solicitud": "2024-01-01T10:00:00Z",
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-02T15:30:00Z",
      "archivos_urls": ["url1", "url2"],
      "docs_translated": ["url3"],
      "word_count": 1500,
      "estimated_delivery": "2024-01-06T10:00:00Z"
    }
  ],
  "count": 25,
  "total": 100
}
```

#### GET /orders/:id
Obtener una orden específica por ID.

**Response:**
```json
{
  "id": "uuid",
  "nombre": "Juan Pérez",
  "correo": "juan@email.com",
  "telefono": "+1234567890",
  "idioma_origen": "Español",
  "idioma_destino": "Inglés",
  "status": "completado",
  "tiempo_procesamiento": 5,
  "progress": 100,
  "internal_notes": "Traducción completada y revisada",
  "fecha_solicitud": "2024-01-01T10:00:00Z",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-05T16:45:00Z",
  "archivos_urls": ["url1", "url2"],
  "docs_translated": ["url3", "url4"],
  "word_count": 1500,
  "estimated_delivery": "2024-01-06T10:00:00Z"
}
```

#### POST /orders
Crear nueva orden de traducción.

**Request:**
```json
{
  "nombre": "María García",
  "correo": "maria@email.com",
  "telefono": "+1987654321",
  "idioma_origen": "Francés",
  "idioma_destino": "Español",
  "tiempo_procesamiento": 7,
  "archivos_urls": ["url1"],
  "word_count": 2000,
  "internal_notes": "Cliente VIP"
}
```

**Response:**
```json
{
  "id": "new-uuid",
  "nombre": "María García",
  "correo": "maria@email.com",
  "telefono": "+1987654321",
  "idioma_origen": "Francés",
  "idioma_destino": "Español",
  "status": "nuevo",
  "tiempo_procesamiento": 7,
  "progress": 0,
  "internal_notes": "Cliente VIP",
  "fecha_solicitud": "2024-01-02T10:00:00Z",
  "created_at": "2024-01-02T10:00:00Z",
  "updated_at": "2024-01-02T10:00:00Z",
  "archivos_urls": ["url1"],
  "docs_translated": [],
  "word_count": 2000,
  "estimated_delivery": "2024-01-09T10:00:00Z"
}
```

#### PUT /orders/:id
Actualizar orden existente.

**Request:**
```json
{
  "status": "completado",
  "progress": 100,
  "internal_notes": "Traducción finalizada",
  "docs_translated": ["url3", "url4"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "completado",
  "progress": 100,
  "internal_notes": "Traducción finalizada",
  "docs_translated": ["url3", "url4"],
  "updated_at": "2024-01-05T16:45:00Z"
}
```

#### DELETE /orders/:id
Eliminar orden.

**Response:**
```json
{
  "message": "Order deleted successfully",
  "id": "uuid"
}
```

### 👤 Profile (Perfil de Usuario)

#### GET /profile
Obtener perfil del usuario actual.

**Response:**
```json
{
  "id": "uuid",
  "user_id": "auth-uuid",
  "full_name": "Juan Pérez",
  "avatar_url": "https://example.com/avatar.jpg",
  "phone": "+1234567890",
  "department": "Traducción",
  "role": "translator",
  "is_active": true,
  "last_login": "2024-01-02T09:15:00Z",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-02T09:15:00Z"
}
```

#### PUT /profile
Actualizar perfil del usuario.

**Request:**
```json
{
  "full_name": "Juan Carlos Pérez",
  "phone": "+1234567890",
  "department": "Traducción Senior",
  "role": "manager"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "auth-uuid",
  "full_name": "Juan Carlos Pérez",
  "phone": "+1234567890",
  "department": "Traducción Senior",
  "role": "manager",
  "updated_at": "2024-01-02T10:30:00Z"
}
```

### 🏢 Company (Configuración de Empresa)

#### GET /company
Obtener configuración de la empresa.

**Response:**
```json
{
  "id": "uuid",
  "company_name": "Translators Inc",
  "company_logo": "https://example.com/logo.png",
  "company_address": "123 Main St, City, Country",
  "company_phone": "+1234567890",
  "company_email": "info@translators.com",
  "company_website": "https://translators.com",
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_user": "noreply@translators.com",
  "smtp_secure": true,
  "backup_enabled": true,
  "backup_frequency": "daily",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-02T10:00:00Z"
}
```

#### PUT /company
Actualizar configuración de la empresa.

**Request:**
```json
{
  "company_name": "Translation Services Ltd",
  "company_email": "contact@translationservices.com",
  "smtp_host": "smtp.outlook.com",
  "smtp_port": 587,
  "smtp_user": "noreply@translationservices.com",
  "smtp_password": "app_password_here",
  "smtp_secure": true,
  "backup_enabled": true,
  "backup_frequency": "weekly"
}
```

**Response:**
```json
{
  "id": "uuid",
  "company_name": "Translation Services Ltd",
  "company_email": "contact@translationservices.com",
  "smtp_host": "smtp.outlook.com",
  "smtp_port": 587,
  "smtp_user": "noreply@translationservices.com",
  "smtp_secure": true,
  "backup_enabled": true,
  "backup_frequency": "weekly",
  "updated_at": "2024-01-02T11:00:00Z"
}
```

### 🔔 Notifications (Notificaciones)

#### GET /notifications
Obtener notificaciones del usuario.

**Query Parameters:**
- `limit` (number): Límite de resultados (default: 50)
- `offset` (number): Offset para paginación (default: 0)
- `unread_only` (boolean): Solo notificaciones no leídas (default: false)
- `type` (string): Filtrar por tipo (`info`, `success`, `warning`, `error`)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "user-uuid",
      "title": "Nueva orden asignada",
      "message": "Se te ha asignado la orden #12345",
      "type": "info",
      "is_read": false,
      "action_url": "/orden/12345",
      "created_at": "2024-01-02T10:00:00Z"
    }
  ],
  "unread_count": 5,
  "total": 25
}
```

#### POST /notifications
Crear nueva notificación.

**Request:**
```json
{
  "title": "Orden completada",
  "message": "La orden #12345 ha sido completada",
  "type": "success",
  "action_url": "/orden/12345"
}
```

**Response:**
```json
{
  "id": "new-uuid",
  "user_id": "user-uuid",
  "title": "Orden completada",
  "message": "La orden #12345 ha sido completada",
  "type": "success",
  "is_read": false,
  "action_url": "/orden/12345",
  "created_at": "2024-01-02T11:00:00Z"
}
```

#### PUT /notifications/:id/read
Marcar notificación como leída.

**Response:**
```json
{
  "id": "uuid",
  "is_read": true,
  "updated_at": "2024-01-02T11:05:00Z"
}
```

#### PUT /notifications/read-all
Marcar todas las notificaciones como leídas.

**Response:**
```json
{
  "message": "All notifications marked as read",
  "updated_count": 5
}
```

#### DELETE /notifications/:id
Eliminar notificación.

**Response:**
```json
{
  "message": "Notification deleted successfully",
  "id": "uuid"
}
```

### 📧 SMTP (Sistema de Correo)

#### POST /smtp/test
Probar configuración SMTP.

**Request:**
```json
{
  "smtp_host": "smtp.gmail.com",
  "smtp_port": 587,
  "smtp_user": "test@gmail.com",
  "smtp_password": "app_password",
  "smtp_secure": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMTP connection successful",
  "response_time_ms": 234
}
```

#### POST /smtp/send
Enviar email.

**Request:**
```json
{
  "to": "cliente@email.com",
  "subject": "Su orden está lista",
  "text": "Su traducción ha sido completada.",
  "html": "<p>Su traducción ha sido <strong>completada</strong>.</p>",
  "attachments": [
    {
      "filename": "traduccion.pdf",
      "url": "https://storage.url/file.pdf"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id@smtp.server>"
}
```

### 💾 Backup (Sistema de Respaldo)

#### POST /backup/create
Crear backup manual.

**Response:**
```json
{
  "success": true,
  "backup_id": "backup-uuid",
  "filename": "backup-2024-01-02.json",
  "download_url": "https://storage.url/backup-2024-01-02.json",
  "size_bytes": 1048576,
  "created_at": "2024-01-02T12:00:00Z"
}
```

#### GET /backup/list
Listar backups disponibles.

**Response:**
```json
{
  "data": [
    {
      "id": "backup-uuid",
      "filename": "backup-2024-01-02.json",
      "size_bytes": 1048576,
      "created_at": "2024-01-02T12:00:00Z",
      "download_url": "https://storage.url/backup-2024-01-02.json"
    }
  ],
  "total": 10
}
```

#### POST /backup/restore
Restaurar desde backup.

**Request:**
```json
{
  "backup_id": "backup-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Backup restored successfully",
  "restored_records": {
    "orders": 50,
    "profiles": 5,
    "notifications": 25,
    "settings": 1
  }
}
```

### 📊 Analytics (Estadísticas)

#### GET /analytics/dashboard
Obtener estadísticas del dashboard.

**Query Parameters:**
- `period` (string): Período de tiempo (`today`, `week`, `month`, `year`)
- `start_date` (string): Fecha de inicio (ISO 8601)
- `end_date` (string): Fecha de fin (ISO 8601)

**Response:**
```json
{
  "summary": {
    "total_orders": 150,
    "new_orders": 25,
    "in_progress": 30,
    "completed": 80,
    "delivered": 15
  },
  "trends": {
    "orders_per_day": [
      { "date": "2024-01-01", "count": 5 },
      { "date": "2024-01-02", "count": 8 }
    ],
    "completion_rate": 85.5,
    "average_processing_time": 4.2
  },
  "top_languages": [
    { "source": "Español", "target": "Inglés", "count": 45 },
    { "source": "Inglés", "target": "Francés", "count": 32 }
  ]
}
```

### 📁 Files (Gestión de Archivos)

#### POST /files/upload
Subir archivo.

**Request:** (multipart/form-data)
```
file: [binary data]
order_id: "uuid"
type: "original" | "translated"
```

**Response:**
```json
{
  "success": true,
  "file_id": "file-uuid",
  "filename": "documento.pdf",
  "url": "https://storage.url/documento.pdf",
  "size_bytes": 2048576,
  "mime_type": "application/pdf",
  "uploaded_at": "2024-01-02T13:00:00Z"
}
```

#### GET /files/:id/download
Descargar archivo.

**Response:** Binary file stream

#### DELETE /files/:id
Eliminar archivo.

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "file_id": "file-uuid"
}
```

## WebSocket Events

### Conexión
```javascript
const ws = new WebSocket('ws://localhost:6300/ws');
```

### Eventos Disponibles

#### order:updated
```json
{
  "event": "order:updated",
  "data": {
    "id": "order-uuid",
    "status": "completado",
    "progress": 100,
    "updated_at": "2024-01-02T14:00:00Z"
  }
}
```

#### notification:new
```json
{
  "event": "notification:new",
  "data": {
    "id": "notification-uuid",
    "title": "Nueva notificación",
    "message": "Tienes una nueva notificación",
    "type": "info",
    "created_at": "2024-01-02T14:05:00Z"
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "timestamp": "2024-01-02T10:00:00Z",
    "request_id": "req-uuid"
  }
}
```

### Common Error Codes

| Código | Descripción |
|--------|-------------|
| `VALIDATION_ERROR` | Error de validación de datos |
| `AUTHENTICATION_ERROR` | Error de autenticación |
| `AUTHORIZATION_ERROR` | Sin permisos suficientes |
| `NOT_FOUND` | Recurso no encontrado |
| `DUPLICATE_ENTRY` | Entrada duplicada |
| `RATE_LIMIT_EXCEEDED` | Límite de requests excedido |
| `INTERNAL_ERROR` | Error interno del servidor |

## Rate Limiting

### Límites por Endpoint

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| `/auth/*` | 5 requests | 1 minuto |
| `/orders` | 100 requests | 1 minuto |
| `/files/upload` | 10 requests | 1 minuto |
| `/*` | 1000 requests | 1 hora |

### Headers de Rate Limit
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200
```

## SDKs y Ejemplos

### JavaScript/TypeScript
```typescript
import { TranslationAPI } from './translation-api-client';

const api = new TranslationAPI({
  baseURL: 'http://localhost:6300/api',
  token: 'your-jwt-token'
});

// Obtener órdenes
const orders = await api.orders.list({
  status: 'en_proceso',
  limit: 10
});

// Crear orden
const newOrder = await api.orders.create({
  nombre: 'Cliente',
  correo: 'cliente@email.com',
  // ...
});
```

### Python
```python
import requests

class TranslationAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {'Authorization': f'Bearer {token}'}
    
    def get_orders(self, status=None):
        params = {'status': status} if status else {}
        response = requests.get(
            f'{self.base_url}/orders',
            headers=self.headers,
            params=params
        )
        return response.json()

api = TranslationAPI('http://localhost:6300/api', 'your-token')
orders = api.get_orders(status='nuevo')
```

### cURL Examples
```bash
# Obtener órdenes
curl -X GET "http://localhost:6300/api/orders" \
  -H "Authorization: Bearer your-jwt-token"

# Crear orden
curl -X POST "http://localhost:6300/api/orders" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cliente Test",
    "correo": "test@email.com",
    "telefono": "+1234567890",
    "idioma_origen": "Español",
    "idioma_destino": "Inglés",
    "tiempo_procesamiento": 5
  }'
```