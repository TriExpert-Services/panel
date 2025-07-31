import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Download, Clock, Languages, Calendar, BarChart3, Shield, ExternalLink, ArrowLeft } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { DocumentCard } from '../components/DocumentCard';
import { TranslationOrder, TranslationOrderService } from '../lib/supabase';

export function ClientVerification() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<TranslationOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = async () => {
    if (!token) {
      setError('Token de verificación no válido');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await TranslationOrderService.getByVerificationToken(token);
      
      if (data) {
        setOrder(data);
      } else {
        setError('Orden no encontrada o token inválido');
      }
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Error al cargar la orden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [token]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return dateString;
    }
  };

  const getProgressMessage = (status: string, progress: number) => {
    switch (status) {
      case 'nuevo':
        return 'Su orden ha sido recibida y será procesada pronto.';
      case 'en_proceso':
        return `Su traducción está en progreso (${progress}% completado).`;
      case 'completado':
        return 'Su traducción ha sido completada y está lista para entrega.';
      case 'entregado':
        return 'Su traducción ha sido entregada. Puede descargar los archivos traducidos.';
      default:
        return 'Estado desconocido.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Verificando orden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Acceso No Autorizado</h2>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Orden no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Verificación de Traducción
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Estado de su orden</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Order Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Orden #{order.id.slice(0, 8)}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Cliente: {order.nombre}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={order.status} />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Solicitado el {formatDate(order.fecha_solicitud)}
                </p>
              </div>
            </div>

            {/* Progress Message */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Estado de su Traducción
                  </h3>
                  <p className="text-blue-800 dark:text-blue-400">
                    {getProgressMessage(order.status, order.progress)}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progreso</span>
                <span className="text-sm font-bold text-blue-600">{order.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${order.progress}%` }}
                />
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Languages className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Idiomas</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {order.idioma_origen} → {order.idioma_destino}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tiempo Est.</p>
                  <PriorityBadge processingTime={order.tiempo_procesamiento} />
                </div>
              </div>

              {order.word_count && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Palabras</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {order.word_count.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {order.estimated_delivery && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Entrega Est.</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {new Date(order.estimated_delivery).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Archivos de Traducción</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DocumentCard
                title="Documento Original"
                documents={Array.isArray(order.archivos_urls) ? order.archivos_urls : []}
                uploadDate={order.created_at}
                wordCount={order.word_count}
                fileType={order.document_type}
              />

              <DocumentCard
                title="Documento Traducido"
                documents={(() => {
                  if (!order.docs_translated) return [];
                  if (Array.isArray(order.docs_translated)) return order.docs_translated;
                  if (typeof order.docs_translated === 'string') return [order.docs_translated];
                  return [];
                })()}
                uploadDate={order.updated_at}
                wordCount={order.word_count}
                fileType={order.document_type}
                showUpload={false}
              />
            </div>

            {/* Download Notice */}
            {order.status === 'completado' || order.status === 'entregado' ? (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Download className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-300">
                      ¡Su traducción está lista!
                    </h3>
                    <p className="text-green-800 dark:text-green-400">
                      Puede descargar los archivos traducidos haciendo clic en los botones de descarga.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                      Traducción en Proceso
                    </h3>
                    <p className="text-blue-800 dark:text-blue-400">
                      Los archivos traducidos estarán disponibles para descarga una vez completada la traducción.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              ¿Necesita Ayuda?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Si tiene preguntas sobre su traducción o necesita asistencia, no dude en contactarnos:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:soporte@translation-admin.com"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Enviar Email</span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Llamar Ahora</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}