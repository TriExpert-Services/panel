import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  es: {
    translation: {
      "common": {
        "save": "Guardar",
        "cancel": "Cancelar",
        "delete": "Eliminar",
        "edit": "Editar",
        "view": "Ver",
        "search": "Buscar",
        "filter": "Filtrar",
        "loading": "Cargando",
        "error": "Error",
        "success": "Éxito",
        "refresh": "Actualizar",
        "export": "Exportar"
      },
      "navigation": {
        "dashboard": "Dashboard",
        "profile": "Perfil",
        "company": "Empresa",
        "templates": "Plantillas",
        "logout": "Salir",
        "notifications": "Notificaciones"
      },
      "dashboard": {
        "title": "Dashboard",
        "subtitle": "Gestiona todas las órdenes de traducción",
        "newOrder": "Nueva Orden",
        "noOrders": {
          "title": "No hay órdenes",
          "description": "No se encontraron órdenes con los filtros aplicados",
          "noData": "No hay órdenes de traducción aún"
        },
        "stats": {
          "total": "Total",
          "new": "Nuevas",
          "inProgress": "En Proceso",
          "completed": "Completadas",
          "delivered": "Entregadas"
        },
        "filters": {
          "searchPlaceholder": "Buscar por nombre, correo o idiomas...",
          "allStatuses": "Todos los estados"
        },
        "table": {
          "client": "Cliente",
          "contact": "Contacto",
          "languages": "Idiomas",
          "status": "Estado",
          "processingTime": "Tiempo Procesamiento",
          "date": "Fecha",
          "actions": "Acciones",
          "ordersCount": "{{count}} de {{total}} órdenes"
        }
      },
      "orders": {
        "statuses": {
          "nuevo": "Nuevo",
          "en_proceso": "En Proceso",
          "completado": "Completado",
          "entregado": "Entregado"
        },
        "priorities": {
          "urgent": "Urgente",
          "high": "Alta",
          "medium": "Media",
          "low": "Baja"
        }
      },
      "documents": {
        "originalDocument": "Documento Original",
        "translatedDocument": "Documento Traducido",
        "noOriginalDocs": "No hay documentos originales",
        "noTranslatedDocs": "No hay documentos traducidos",
        "uploadDocument": "Subir Documento",
        "addMoreFiles": "Agregar más archivos",
        "downloadFile": "Descargar",
        "totalFiles": "{{count}} archivo{{count, plural, one {} other {s}}} - {{words}} palabras"
      },
      "fileUpload": {
        "dragHere": "Arrastra archivos aquí",
        "clickToSelect": "o haz clic para seleccionar",
        "supportedTypes": "Tipos soportados: {{types}}",
        "maxSize": "Máximo {{size}}MB",
        "dropHere": "Suelta los archivos aquí",
        "uploading": "Subiendo archivo...",
        "fileLoaded": "Archivo cargado",
        "fileTooLarge": "El archivo es demasiado grande. Tamaño máximo: {{size}}MB",
        "invalidType": "Tipo de archivo no válido. Tipos permitidos: {{types}}"
      },
      "clientVerification": {
        "title": "Verificación de Cliente",
        "subtitle": "Estado de su traducción",
        "verifying": "Verificando acceso...",
        "accessDenied": "Acceso Denegado",
        "goHome": "Ir al Inicio",
        "orderNumber": "Orden #{{id}}",
        "client": "Cliente: {{name}}",
        "requestedOn": "Solicitado el {{date}}",
        "translationStatus": "Estado de la Traducción",
        "progress": "Progreso",
        "languages": "Idiomas",
        "estimatedTime": "Tiempo Estimado",
        "words": "Palabras",
        "estimatedDelivery": "Entrega Estimada",
        "translationFiles": "Archivos de Traducción",
        "translationReady": {
          "title": "¡Traducción Lista!",
          "description": "Su traducción ha sido completada y está disponible para descarga."
        },
        "translationInProgress": {
          "title": "Traducción en Progreso",
          "description": "Su traducción está siendo procesada por nuestro equipo."
        },
        "certification": {
          "title": "Traducción Certificada",
          "subtitle": "Calidad Profesional Garantizada",
          "description": "Traducción realizada por expertos certificados",
          "features": {
            "professional": "Profesional",
            "verified": "Verificado",
            "guaranteed": "Garantizado"
          },
          "verifiedOn": "Orden {{id}} verificada el {{date}}"
        },
        "needHelp": {
          "title": "¿Necesita Ayuda?",
          "description": "Si tiene alguna pregunta, puede contactarnos:",
          "loadingContact": "Cargando información de contacto...",
          "noContactInfo": "Información de contacto por defecto",
          "sendEmail": "Enviar Email",
          "callNow": "Llamar Ahora"
        },
        "statusMessages": {
          "nuevo": "Su traducción ha sido recibida y será procesada pronto.",
          "en_proceso": "Su traducción está en progreso ({{progress}}% completado).",
          "completado": "Su traducción ha sido completada y está lista para descarga.",
          "entregado": "Su traducción ha sido entregada exitosamente."
        }
      },
      "auth": {
        "login": "Iniciar Sesión",
        "signup": "Crear Cuenta",
        "email": "Correo Electrónico",
        "password": "Contraseña",
        "confirmPassword": "Confirmar Contraseña",
        "createAccount": "Crear Cuenta",
        "hasAccount": "¿Ya tienes cuenta? Inicia sesión",
        "noAccount": "¿No tienes cuenta? Regístrate",
        "passwordMismatch": "Las contraseñas no coinciden",
        "passwordMinLength": "La contraseña debe tener al menos 6 caracteres",
        "accountCreated": "Cuenta creada exitosamente. Puedes iniciar sesión ahora.",
        "invalidCredentials": "Email o contraseña incorrectos"
      },
      "confirmDialog": {
        "deleteOrder": {
          "title": "Eliminar Orden",
          "message": "¿Estás seguro de que quieres eliminar esta orden? Esta acción no se puede deshacer."
        }
      },
      "language": {
        "changeLanguage": "Cambiar idioma"
      },
      "app": {
        "title": "Sistema de Administración de Traducciones",
        "version": "v{{version}}",
        "description": "Sistema completo de gestión de traducciones"
      }
    }
  },
  en: {
    translation: {
      "common": {
        "save": "Save",
        "cancel": "Cancel",
        "delete": "Delete",
        "edit": "Edit",
        "view": "View",
        "search": "Search",
        "filter": "Filter",
        "loading": "Loading",
        "error": "Error",
        "success": "Success",
        "refresh": "Refresh",
        "export": "Export"
      },
      "navigation": {
        "dashboard": "Dashboard",
        "profile": "Profile",
        "company": "Company",
        "templates": "Templates",
        "logout": "Logout",
        "notifications": "Notifications"
      },
      "dashboard": {
        "title": "Dashboard",
        "subtitle": "Manage all translation orders",
        "newOrder": "New Order",
        "noOrders": {
          "title": "No orders",
          "description": "No orders found with applied filters",
          "noData": "No translation orders yet"
        },
        "stats": {
          "total": "Total",
          "new": "New",
          "inProgress": "In Progress",
          "completed": "Completed",
          "delivered": "Delivered"
        },
        "filters": {
          "searchPlaceholder": "Search by name, email or languages...",
          "allStatuses": "All statuses"
        },
        "table": {
          "client": "Client",
          "contact": "Contact",
          "languages": "Languages",
          "status": "Status",
          "processingTime": "Processing Time",
          "date": "Date",
          "actions": "Actions",
          "ordersCount": "{{count}} of {{total}} orders"
        }
      },
      "orders": {
        "statuses": {
          "nuevo": "New",
          "en_proceso": "In Progress",
          "completado": "Completed",
          "entregado": "Delivered"
        },
        "priorities": {
          "urgent": "Urgent",
          "high": "High",
          "medium": "Medium",
          "low": "Low"
        }
      },
      "documents": {
        "originalDocument": "Original Document",
        "translatedDocument": "Translated Document",
        "noOriginalDocs": "No original documents",
        "noTranslatedDocs": "No translated documents",
        "uploadDocument": "Upload Document",
        "addMoreFiles": "Add more files",
        "downloadFile": "Download",
        "totalFiles": "{{count}} file{{count, plural, one {} other {s}}} - {{words}} words"
      },
      "fileUpload": {
        "dragHere": "Drag files here",
        "clickToSelect": "or click to select",
        "supportedTypes": "Supported types: {{types}}",
        "maxSize": "Maximum {{size}}MB",
        "dropHere": "Drop files here",
        "uploading": "Uploading file...",
        "fileLoaded": "File loaded",
        "fileTooLarge": "File is too large. Maximum size: {{size}}MB",
        "invalidType": "Invalid file type. Allowed types: {{types}}"
      },
      "clientVerification": {
        "title": "Client Verification",
        "subtitle": "Your translation status",
        "verifying": "Verifying access...",
        "accessDenied": "Access Denied",
        "goHome": "Go Home",
        "orderNumber": "Order #{{id}}",
        "client": "Client: {{name}}",
        "requestedOn": "Requested on {{date}}",
        "translationStatus": "Translation Status",
        "progress": "Progress",
        "languages": "Languages",
        "estimatedTime": "Estimated Time",
        "words": "Words",
        "estimatedDelivery": "Estimated Delivery",
        "translationFiles": "Translation Files",
        "translationReady": {
          "title": "Translation Ready!",
          "description": "Your translation has been completed and is available for download."
        },
        "translationInProgress": {
          "title": "Translation in Progress",
          "description": "Your translation is being processed by our team."
        },
        "certification": {
          "title": "Certified Translation",
          "subtitle": "Professional Quality Guaranteed",
          "description": "Translation performed by certified experts",
          "features": {
            "professional": "Professional",
            "verified": "Verified",
            "guaranteed": "Guaranteed"
          },
          "verifiedOn": "Order {{id}} verified on {{date}}"
        },
        "needHelp": {
          "title": "Need Help?",
          "description": "If you have any questions, you can contact us:",
          "loadingContact": "Loading contact information...",
          "noContactInfo": "Default contact information",
          "sendEmail": "Send Email",
          "callNow": "Call Now"
        },
        "statusMessages": {
          "nuevo": "Your translation has been received and will be processed soon.",
          "en_proceso": "Your translation is in progress ({{progress}}% completed).",
          "completado": "Your translation has been completed and is ready for download.",
          "entregado": "Your translation has been successfully delivered."
        }
      },
      "auth": {
        "login": "Login",
        "signup": "Sign Up",
        "email": "Email",
        "password": "Password",
        "confirmPassword": "Confirm Password",
        "createAccount": "Create Account",
        "hasAccount": "Already have an account? Sign in",
        "noAccount": "Don't have an account? Sign up",
        "passwordMismatch": "Passwords don't match",
        "passwordMinLength": "Password must be at least 6 characters",
        "accountCreated": "Account created successfully. You can now sign in.",
        "invalidCredentials": "Invalid email or password"
      },
      "confirmDialog": {
        "deleteOrder": {
          "title": "Delete Order",
          "message": "Are you sure you want to delete this order? This action cannot be undone."
        }
      },
      "language": {
        "changeLanguage": "Change language"
      },
      "app": {
        "title": "Translation Administration System",
        "version": "v{{version}}",
        "description": "Complete translation management system"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;