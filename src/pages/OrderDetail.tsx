import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, RefreshCw, Download, Upload, FileText, Clock, User, Mail, Phone, Languages, Calendar, BarChart3, ExternalLink, Copy } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { FileUpload } from '../components/FileUpload';
import { DocumentCard } from '../components/DocumentCard';
import { TranslationOrder, TranslationOrderService } from '../lib/supabase';

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<TranslationOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [formData, setFormData] = useState({
    status: 'nuevo' as TranslationOrder['status'],
    progress: 0,
    internal_notes: ''
  });

  const loadOrder = async () => {
    if (!id) {
      setError('ID de orden no válido');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const data = await TranslationOrderService.getById(id);
      
      if (data) {
        setOrder(data);
        setFormData({
          status: data.status,
          progress: data.progress || 0,
          internal_notes: data.internal_notes || ''
        });
      } else {
        setError('Orden no encontrada');
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
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !order) return;
    
    setSaving(true);
    setError(null);

    try {
      const updatedOrder = await TranslationOrderService.update(id, formData);
      setOrder(updatedOrder);
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Error al actualizar la orden');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadingFile(true);
    setError(null);
    
    try {
      console.log('=== STARTING FILE UPLOAD PROCESS ===');
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      const fileUrl = await TranslationOrderService.uploadTranslatedDocument(file, id!);
      console.log('=== FILE UPLOADED SUCCESSFULLY ===');
      console.log('Generated URL:', fileUrl);
      
      if (id && order) {
        console.log('=== UPDATING DATABASE ===');
        console.log('Current order.docs_translated:', order.docs_translated);
        
        // Get existing translated documents and filter out any null/empty values
        let existingDocs: string[] = [];
        if (order.docs_translated) {
          console.log('=== PROCESSING EXISTING DOCS ===');
          console.log('Raw order.docs_translated:', order.docs_translated);
          console.log('Type:', typeof order.docs_translated);
          
          if (Array.isArray(order.docs_translated)) {
            // Handle array that might contain JSON strings
            for (const item of order.docs_translated) {
              if (typeof item === 'string' && item.trim().length > 0) {
                // Check if it's a JSON string
                if ((item.startsWith('[') && item.endsWith(']')) || (item.startsWith('"') && item.endsWith('"'))) {
                  try {
                    const parsed = JSON.parse(item);
                    if (Array.isArray(parsed)) {
                      existingDocs.push(...parsed.filter(url => url && typeof url === 'string'));
                    } else if (typeof parsed === 'string') {
                      existingDocs.push(parsed);
                    }
                  } catch (e) {
                    // If parsing fails, treat as regular string
                    existingDocs.push(item);
                  }
                } else {
                  // Regular string URL
                  existingDocs.push(item);
                }
              }
            }
          } else if (typeof order.docs_translated === 'string') {
            // Handle case where it might be stored as a JSON string
            try {
              const parsed = JSON.parse(order.docs_translated);
              if (Array.isArray(parsed)) {
                existingDocs = parsed.filter(url => url && typeof url === 'string');
              } else {
                existingDocs = [order.docs_translated];
              }
            } catch (e) {
              existingDocs = [order.docs_translated];
            }
          }
        }
        
        console.log('=== EXISTING DOCS BEFORE UPLOAD ===', existingDocs);
        const updatedDocs = [...existingDocs, fileUrl];
        console.log('=== UPDATED DOCS ARRAY ===', updatedDocs);
        console.log('=== UPDATED DOCS TYPE ===', typeof updatedDocs);
        
        // Update the database
        const updatedOrder = await TranslationOrderService.update(id, {
          docs_translated: updatedDocs
        });
        
        console.log('=== ORDER UPDATED IN DATABASE ===');
        console.log('Updated order:', updatedOrder);
        console.log('New docs_translated field:', updatedOrder.docs_translated);
        console.log('Type of new docs_translated:', typeof updatedOrder.docs_translated);
        
        // Update local state
        console.log('=== UPDATING LOCAL STATE ===');
        setOrder(updatedOrder);
        setShowFileUpload(false);
        
        // Force a re-render after a small delay to ensure state is updated
        setTimeout(() => {
          console.log('=== FORCING RE-RENDER ===');
          setOrder(prevOrder => ({ ...prevOrder!, ...updatedOrder }));
        }, 100);
        
      } else {
        throw new Error('No se pudo obtener la información de la orden');
      }
      
    } catch (err) {
      console.error('=== FILE UPLOAD ERROR ===', err);
      setError('Error al subir el archivo');
    } finally {
      setUploadingFile(false);
    }
  };

  const getVerificationUrl = () => {
    if (!order?.verification_token) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/verificar/${order.verification_token}`;
  };

  const copyVerificationUrl = async () => {
    const url = getVerificationUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

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

  // Add error boundary protection
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 mb-2"
          >
            Volver al dashboard
          </button>
          <button
            onClick={loadOrder}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-gray-600 font-medium">Cargando orden...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 mb-4">Orden no encontrada</p>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800"
        >
          Volver al dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Dashboard</span>
        </button>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Orden #{order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Gestiona los detalles y estado de la orden</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progreso de Traducción</h3>
          <span className="text-2xl font-bold text-blue-600">{order.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{ width: `${order.progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
          <span>Iniciado</span>
          <span>En progreso</span>
          <span>Completado</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-8">
          {/* Client Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Información del Cliente</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Nombre del Cliente
                  </label>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{order.nombre}</p>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Correo Electrónico
                  </label>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <p className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
                      {order.correo}
                    </p>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Teléfono
                  </label>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{order.telefono}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Idioma Origen
                  </label>
                  <div className="flex items-center space-x-3">
                    <Languages className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{order.idioma_origen}</p>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Idioma Destino
                  </label>
                  <div className="flex items-center space-x-3">
                    <Languages className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{order.idioma_destino}</p>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Fecha de Solicitud
                  </label>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{formatDate(order.fecha_solicitud)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Estado Actual
                </label>
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Tiempo de Procesamiento
                </label>
                  <PriorityBadge processingTime={order.tiempo_procesamiento} />
                </div>
              </div>
            </div>
          </div>

          {/* Document Management */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gestión de Documentos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  console.log('OrderDetail - Processing docs_translated:', order.docs_translated);
                  console.log('OrderDetail - Type of docs_translated:', typeof order.docs_translated);
                  
                  if (!order.docs_translated) {
                    console.log('OrderDetail - No docs_translated found');
                    return [];
                  }
                  
                  if (Array.isArray(order.docs_translated)) {
                    console.log('OrderDetail - docs_translated is array:', order.docs_translated);
                    return order.docs_translated;
                  }
                  
                  if (typeof order.docs_translated === 'string') {
                    console.log('OrderDetail - docs_translated is string, converting to array:', [order.docs_translated]);
                    return [order.docs_translated];
                  }
                  
                  console.log('OrderDetail - Unknown docs_translated format, returning empty array');
                  return [];
                })()}
                uploadDate={order.updated_at}
                wordCount={order.word_count}
                fileType={order.document_type}
                onUpload={() => setShowFileUpload(true)}
                showUpload={true}
              />
            </div>
          </div>

          {/* File Upload Modal */}
          {showFileUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Subir Documento Traducido</h3>
                    <button
                      onClick={() => setShowFileUpload(false)}
                      className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <FileUpload
                    onFileSelect={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    maxSize={50}
                    loading={uploadingFile}
                    currentFile={uploadingFile ? "Subiendo archivo..." : undefined}
                  />
                  
                  {error && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700 rounded-xl">
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowFileUpload(false)}
                      className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Update Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Save className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Actualizar Estado</h2>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Estado
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TranslationOrder['status'] })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="completado">Completado</option>
                  <option value="entregado">Entregado</option>
                </select>
              </div>

              <div>
                <label htmlFor="progress" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Progreso (%)
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    id="progress"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span className="font-bold text-blue-600 text-lg">{formData.progress}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="internal_notes" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Notas Internas
                </label>
                <textarea
                  id="internal_notes"
                  rows={4}
                  value={formData.internal_notes}
                  onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Añade notas internas para el equipo de traducción..."
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                >
                  {saving ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{saving ? 'Guardando...' : 'Guardar cambios'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Client Verification Link */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Enlace de Verificación</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Comparta este enlace con el cliente para que pueda verificar el estado de su traducción y descargar archivos:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <input
                  type="text"
                  value={getVerificationUrl()}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none"
                />
                <button
                  onClick={copyVerificationUrl}
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copySuccess ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              
              <div className="flex space-x-2">
                <a
                  href={getVerificationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium flex-1 justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Vista Previa</span>
                </a>
                <a
                  href={`mailto:${order?.correo}?subject=Estado de su traducción&body=Hola ${order?.nombre},%0A%0APuede verificar el estado de su traducción y descargar los archivos completados en el siguiente enlace:%0A%0A${getVerificationUrl()}%0A%0ASaludos cordiales`}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors font-medium flex-1 justify-center"
                >
                  <Mail className="w-4 h-4" />
                  <span>Enviar Email</span>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Resumen del Proyecto</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado:</span>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progreso:</span>
                <span className="text-lg font-bold text-blue-600">{order.progress}%</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tiempo Procesamiento:</span>
                <PriorityBadge processingTime={order.tiempo_procesamiento} />
              </div>
              {order.word_count && (
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Palabras:</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{order.word_count.toLocaleString()}</span>
                </div>
              )}
              {order.estimated_delivery && (
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Entrega estimada:</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {new Date(order.estimated_delivery).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Notas Internas</h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              {order.internal_notes || 'No hay notas internas disponibles.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}