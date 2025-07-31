# Guía del Usuario 📖

Guía completa para usar el Translation Administration System.

## Tabla de Contenidos

- [Primeros Pasos](#primeros-pasos)
- [Dashboard](#dashboard)
- [Gestión de Órdenes](#gestión-de-órdenes)
- [Documentos](#documentos)
- [Mi Perfil](#mi-perfil)
- [Configuración](#configuración)
- [Notificaciones](#notificaciones)
- [Preguntas Frecuentes](#preguntas-frecuentes)

## Primeros Pasos

### Acceso al Sistema

1. **Abrir navegador** y ir a: `http://localhost:6300`
2. **Pantalla de login**: Se mostrará el formulario de inicio de sesión

![Login Screen](../assets/login-screen.png)

### Crear Cuenta (Primera vez)

1. En la pantalla de login, hacer clic en **"¿No tienes cuenta? Regístrate"**
2. Completar el formulario:
   - **Email**: Tu dirección de correo electrónico
   - **Contraseña**: Mínimo 6 caracteres
   - **Confirmar Contraseña**: Repetir la contraseña
3. Hacer clic en **"Crear Cuenta"**
4. Verificar email si está habilitado
5. Iniciar sesión con las credenciales creadas

### Iniciar Sesión

1. Ingresar **email** y **contraseña**
2. Hacer clic en **"Iniciar Sesión"**
3. Serás redirigido al Dashboard principal

## Dashboard

El Dashboard es la pantalla principal del sistema donde puedes ver un resumen de todas las órdenes de traducción.

### Elementos del Dashboard

#### 1. Header (Cabecera)
- **Logo y nombre** del sistema
- **Navegación principal**: Dashboard, Perfil, Empresa
- **Notificaciones**: Campana con contador de notificaciones no leídas
- **Modo oscuro/claro**: Toggle para cambiar tema
- **Perfil de usuario**: Avatar y opción de cerrar sesión

#### 2. Estadísticas Principales

Las tarjetas de estadísticas muestran:

| Tarjeta | Descripción |
|---------|-------------|
| **Total** | Número total de órdenes en el sistema |
| **Nuevas** | Órdenes con estado "Nuevo" |
| **En Proceso** | Órdenes siendo trabajadas |
| **Completadas** | Órdenes terminadas |
| **Entregadas** | Órdenes ya enviadas al cliente |

#### 3. Filtros de Búsqueda

- **Búsqueda por texto**: Buscar por nombre, email o idiomas
- **Filtro por estado**: Seleccionar estado específico
- **Limpiar filtros**: Resetear todos los filtros

#### 4. Tabla de Órdenes

Columnas disponibles:
- **Cliente**: Nombre del cliente
- **Contacto**: Email y teléfono
- **Idiomas**: Idioma origen → idioma destino
- **Estado**: Badge con estado actual
- **Tiempo Procesamiento**: Días estimados con prioridad
- **Fecha**: Fecha de solicitud
- **Acciones**: Botones Ver y Eliminar

### Acciones Disponibles

#### Ver Orden
1. Hacer clic en **"Ver"** en cualquier orden
2. Se abrirá la página de detalle de la orden

#### Nueva Orden
1. Hacer clic en **"Nueva Orden"** (botón azul superior derecho)
2. Completar formulario de nueva orden

#### Eliminar Orden
1. Hacer clic en **"Eliminar"** en la orden deseada
2. Confirmar eliminación en el diálogo
3. La orden se eliminará permanentemente

## Gestión de Órdenes

### Ver Detalle de Orden

Al hacer clic en "Ver" en cualquier orden, accederás a la página de detalle donde puedes:

#### 1. Información del Cliente
- **Datos personales**: Nombre, email, teléfono
- **Detalles del proyecto**: Idiomas, fecha de solicitud
- **Estado y progreso**: Estado actual y porcentaje completado

#### 2. Barra de Progreso
- **Visualización**: Barra animada que muestra el progreso (0-100%)
- **Estados**: Iniciado → En progreso → Completado

#### 3. Actualizar Estado

**Campos editables:**
- **Estado**: Selector con opciones:
  - `Nuevo`: Orden recién creada
  - `En Proceso`: Traducción en progreso
  - `Completado`: Traducción terminada
  - `Entregado`: Enviado al cliente

- **Progreso**: Slider de 0% a 100%
- **Notas Internas**: Comentarios para el equipo

**Guardar cambios:**
1. Modificar los campos necesarios
2. Hacer clic en **"Guardar cambios"**
3. El sistema confirmará la actualización

#### 4. Sidebar de Información

**Resumen del Proyecto:**
- Estado actual
- Progreso porcentual
- Tiempo de procesamiento
- Número de palabras
- Fecha de entrega estimada

**Notas Internas:**
- Comentarios del equipo
- Observaciones especiales
- Instrucciones adicionales

### Estados de las Órdenes

| Estado | Color | Descripción |
|--------|-------|-------------|
| **Nuevo** | 🔵 Azul | Orden recién creada, pendiente de asignación |
| **En Proceso** | 🟡 Amarillo | Traducción en progreso |
| **Completado** | 🟢 Verde | Traducción terminada, listo para entrega |
| **Entregado** | ⚪ Gris | Enviado al cliente |

### Prioridades de Procesamiento

| Tiempo | Prioridad | Color | Descripción |
|--------|-----------|-------|-------------|
| 1 día | Urgente | 🔴 Rojo | Máxima prioridad |
| 2-3 días | Alta | 🟠 Naranja | Alta prioridad |
| 4-7 días | Media | 🔵 Azul | Prioridad normal |
| +7 días | Baja | ⚪ Gris | Baja prioridad |

## Documentos

### Gestión de Documentos Originales

Los documentos originales son los archivos que sube el cliente para traducir.

#### Visualización
- **Card "Documento Original"**: Muestra archivos originales
- **Información**: Nombre, tipo, tamaño, fecha de subida
- **Acciones**: Botón "Descargar" para cada archivo

### Gestión de Documentos Traducidos

Los documentos traducidos son los archivos finales que se entregan al cliente.

#### Subir Documento Traducido

1. En el detalle de la orden, buscar **"Documento Traducido"**
2. Hacer clic en **"Subir Documento"**
3. Se abrirá el modal de subida

#### Modal de Subida

**Características:**
- **Drag & Drop**: Arrastra archivos a la zona de subida
- **Click para seleccionar**: Hacer clic para seleccionar archivos
- **Validación**: Tipos y tamaños permitidos
- **Vista previa**: Información del archivo seleccionado

**Archivos soportados:**
- **Tipos**: PDF, DOC, DOCX, TXT
- **Tamaño máximo**: 50MB por archivo
- **Múltiples archivos**: Se pueden subir varios a la vez

#### Proceso de Subida

1. **Seleccionar archivo(s)**:
   - Arrastra a la zona de subida, o
   - Haz clic en la zona para seleccionar

2. **Validación automática**:
   - Verificación de tipo de archivo
   - Verificación de tamaño
   - Mostrar errores si los hay

3. **Subida**:
   - Barra de progreso durante la subida
   - Confirmación al completarse
   - Actualización automática de la vista

4. **Visualización**:
   - El archivo aparece en la card "Documento Traducido"
   - Botón "Descargar" disponible
   - Información del archivo (nombre, tamaño, fecha)

#### Descargar Documentos

1. **Documento Original**: Hacer clic en "Descargar"
2. **Documento Traducido**: Hacer clic en "Descargar"
3. El archivo se descargará automáticamente

### Gestión de Múltiples Archivos

#### Visualización de Múltiples Archivos
- Cada archivo se muestra en su propia tarjeta
- Información individual de cada archivo
- Botón de descarga individual

#### Subir Archivos Adicionales
1. Hacer clic en **"Agregar más archivos"**
2. Repetir proceso de subida
3. Los archivos se agregan a la lista existente

## Mi Perfil

### Acceder al Perfil

1. En el header, hacer clic en **"Perfil"**
2. Se abrirá la página de gestión de perfil

### Información Personal

#### Tarjeta de Perfil
- **Avatar circular**: Placeholder con ícono de usuario
- **Botón de cámara**: Para cambiar avatar (futuro)
- **Nombre**: Nombre completo del usuario
- **Email**: Dirección de correo (no editable)
- **Estado**: Cuenta verificada
- **Último acceso**: Fecha y hora del último login

#### Formulario de Información

**Campos editables:**

| Campo | Descripción | Requerido |
|-------|-------------|-----------|
| **Nombre Completo** | Nombre y apellidos | ✅ |
| **Teléfono** | Número de contacto | ❌ |
| **Correo Electrónico** | Email (solo lectura) | ✅ |
| **Departamento** | Área de trabajo | ❌ |
| **Rol** | Función en la empresa | ✅ |

**Roles disponibles:**
- **Traductor**: Usuario estándar
- **Administrador**: Acceso completo al sistema
- **Gerente**: Supervisión de proyectos
- **Revisor**: Revisión de traducciones

### Actualizar Perfil

1. **Editar campos**: Modificar información necesaria
2. **Guardar**: Hacer clic en "Guardar Cambios"
3. **Confirmación**: El sistema mostrará confirmación
4. **Redirección**: Automática al dashboard tras guardar

## Configuración

### Configuración de Empresa

Acceso: Header → **"Empresa"**

#### Pestañas Disponibles

##### 1. Información de Empresa

**Datos básicos:**
- **Nombre de la Empresa**: Denominación social
- **Correo Electrónico**: Email principal
- **Teléfono**: Número de contacto
- **Sitio Web**: URL de la página web
- **Dirección**: Dirección física completa

##### 2. Configuración SMTP

**Para envío de emails automáticos:**

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Servidor SMTP** | Host del servidor de correo | `smtp.gmail.com` |
| **Puerto** | Puerto de conexión | `587` |
| **Usuario SMTP** | Email de envío | `noreply@empresa.com` |
| **Contraseña SMTP** | Contraseña o app password | `••••••••` |
| **Conexión Segura** | SSL/TLS habilitado | ✅ |

**Proveedores comunes:**

| Proveedor | SMTP Host | Puerto | Seguro |
|-----------|-----------|--------|--------|
| **Gmail** | smtp.gmail.com | 587 | ✅ |
| **Outlook** | smtp-mail.outlook.com | 587 | ✅ |
| **Yahoo** | smtp.mail.yahoo.com | 587 | ✅ |

**Probar Conexión:**
1. Configurar datos SMTP
2. Hacer clic en **"Probar Conexión"**
3. El sistema verificará la configuración
4. Confirmación de éxito o error

##### 3. Backup y Seguridad

**Backup Automático:**
- **Habilitar backups**: Checkbox para activar
- **Frecuencia**: Cada hora, diario, semanal, mensual
- **Contenido**: Órdenes, perfiles, configuraciones, notificaciones

**Backup Manual:**
1. Hacer clic en **"Crear Backup"**
2. El sistema genera archivo JSON
3. Descarga automática del backup
4. Notificación de éxito

**Información del Backup:**
- Formato JSON con timestamp
- Incluye todas las tablas principales
- Recomendación de almacenamiento seguro
- Ejecución según frecuencia configurada

### Modo Oscuro/Claro

#### Cambiar Tema
1. En el header, hacer clic en el ícono de **sol/luna**
2. El tema cambia instantáneamente
3. La preferencia se guarda automáticamente

#### Características
- **Persistencia**: Se recuerda entre sesiones
- **Transiciones suaves**: Cambio animado
- **Colores adaptativos**: Paleta optimizada para cada modo
- **Accesibilidad**: Contraste mejorado

## Notificaciones

### Centro de Notificaciones

#### Acceder
1. Hacer clic en el **ícono de campana** en el header
2. Se abre el panel deslizante de notificaciones

#### Elementos del Panel

**Header:**
- **Título**: "Notificaciones"
- **Contador**: Badge con número de no leídas
- **Marcar todas**: Botón para marcar todas como leídas
- **Cerrar**: X para cerrar el panel

**Lista de Notificaciones:**
- **Ícono**: Emoji según el tipo
- **Título**: Asunto de la notificación
- **Mensaje**: Descripción detallada
- **Fecha**: Timestamp de creación
- **Estado**: Leída/no leída (punto azul)

**Footer:**
- **Resumen**: Total de notificaciones y no leídas

#### Tipos de Notificaciones

| Tipo | Ícono | Color | Uso |
|------|-------|-------|-----|
| **Info** | ℹ️ | Azul | Información general |
| **Éxito** | ✅ | Verde | Acciones completadas |
| **Advertencia** | ⚠️ | Amarillo | Alertas importantes |
| **Error** | ❌ | Rojo | Errores o fallos |

#### Acciones Disponibles

**Por notificación individual:**
- **Marcar como leída**: Ícono de check
- **Abrir enlace**: Ícono de enlace externo (si aplica)
- **Eliminar**: Ícono de papelera

**Acciones globales:**
- **Marcar todas como leídas**: Botón en header
- **Cerrar panel**: X o hacer clic fuera

### Notificaciones Automáticas

El sistema genera notificaciones automáticamente para:

#### Eventos de Órdenes
- **Nueva orden creada**
- **Estado cambiado** (nuevo → en proceso → completado → entregado)
- **Documento subido**
- **Progreso actualizado**

#### Eventos del Sistema
- **Backup creado exitosamente**
- **Email enviado**
- **Error en configuración SMTP**
- **Sesión iniciada** (primer login del día)

#### Actualización en Tiempo Real
- **Polling cada 30 segundos** para nuevas notificaciones
- **Badge actualizado** automáticamente
- **Sonido de notificación** (futuro)

## Preguntas Frecuentes

### Funcionalidad Básica

#### ¿Cómo creo una nueva orden?
1. En el Dashboard, hacer clic en "Nueva Orden"
2. Completar el formulario con datos del cliente
3. Subir documentos originales
4. Guardar la orden

#### ¿Puedo editar una orden después de crearla?
Sí, puedes:
- ✅ Cambiar estado y progreso
- ✅ Agregar notas internas
- ✅ Subir documentos traducidos
- ❌ No se pueden editar datos del cliente (contactar administrador)

#### ¿Cómo subo múltiples archivos?
1. En el modal de subida, selecciona múltiples archivos
2. O sube uno por uno usando "Agregar más archivos"
3. Cada archivo se procesa individualmente

### Documentos

#### ¿Qué tipos de archivo puedo subir?
- **Tipos soportados**: PDF, DOC, DOCX, TXT
- **Tamaño máximo**: 50MB por archivo
- **Múltiples archivos**: Sí, sin límite de cantidad

#### ¿Los archivos se guardan de forma segura?
Sí:
- **Almacenamiento**: Supabase Storage con encriptación
- **Acceso**: Solo usuarios autenticados
- **Backup**: Incluidos en respaldos automáticos

#### ¿Puedo descargar archivos en cualquier momento?
Sí, los botones "Descargar" están siempre disponibles para:
- Documentos originales
- Documentos traducidos

### Estados y Progreso

#### ¿Cuándo cambio el estado de una orden?
- **Nuevo → En Proceso**: Al comenzar la traducción
- **En Proceso → Completado**: Al terminar la traducción
- **Completado → Entregado**: Al enviar al cliente

#### ¿El progreso se actualiza automáticamente?
No, debes actualizar manualmente:
1. Usar el slider de progreso (0-100%)
2. Guardar cambios
3. El cliente puede ver el progreso actualizado

### Notificaciones

#### ¿Puedo desactivar las notificaciones?
Actualmente no hay configuración granular, pero puedes:
- Marcar todas como leídas
- Eliminar notificaciones individualmente

#### ¿Las notificaciones se envían por email?
Depende de la configuración SMTP:
- Si está configurado: Sí, automáticamente
- Si no está configurado: Solo en el sistema

### Configuración

#### ¿Quién puede cambiar la configuración de empresa?
- **Administradores**: Acceso completo
- **Gerentes**: Solo ciertos aspectos
- **Traductores**: Solo su perfil personal

#### ¿Qué pasa si pierdo mi contraseña?
1. En login, hacer clic en "¿Olvidaste tu contraseña?"
2. Seguir instrucciones de recuperación
3. Revisar email para enlace de reset

### Problemas Técnicos

#### La página no carga correctamente
1. **Refrescar**: Presionar F5 o Ctrl+R
2. **Limpiar cache**: Ctrl+Shift+R
3. **Verificar conexión**: Comprobar internet
4. **Contactar soporte**: Si persiste el problema

#### Los archivos no se suben
Verificar:
- **Tamaño**: Máximo 50MB
- **Tipo**: PDF, DOC, DOCX, TXT solamente
- **Conexión**: Internet estable
- **Espacio**: Suficiente almacenamiento

#### No recibo notificaciones
1. **Verificar configuración**: Revisar configuración SMTP
2. **Spam**: Revisar carpeta de spam
3. **Email correcto**: Verificar email en perfil

### Rendimiento

#### ¿Cuántas órdenes puede manejar el sistema?
- **Límite técnico**: Miles de órdenes
- **Rendimiento óptimo**: Depende del servidor
- **Paginación**: 50 órdenes por página por defecto

#### ¿Los filtros son rápidos?
Sí:
- **Búsqueda en tiempo real**: Resultados instantáneos
- **Filtros optimizados**: Base de datos indexada
- **Cache**: Resultados frecuentes en cache

### Integración

#### ¿Hay API disponible?
Sí, API REST completa:
- **Documentación**: Ver docs/API.md
- **Endpoints**: Todos los recursos principales
- **Autenticación**: JWT tokens

#### ¿Se puede integrar con otros sistemas?
Sí, mediante:
- **API REST**: Para integraciones personalizadas
- **Webhooks**: Para notificaciones en tiempo real
- **Exports**: CSV, JSON para otros sistemas

¿Necesitas ayuda adicional? Contacta al equipo de soporte! 📞