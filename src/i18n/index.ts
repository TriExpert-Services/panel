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