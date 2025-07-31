import React, { useState, useEffect } from 'react';
import { Mail, Edit, Save, Eye, RefreshCw, Code } from 'lucide-react';
import { EmailTemplate, EmailTemplateService } from '../lib/api';

export function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState<'html' | 'text'>('html');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await EmailTemplateService.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError('Error al cargar las plantillas');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async (template: EmailTemplate) => {
    setSaving(template.id);
    setError(null);
    setSuccess(null);

    try {
      const updated = await EmailTemplateService.updateTemplate(template.id, {
        name: template.name,
        subject: template.subject,
        html_content: template.html_content,
        text_content: template.text_content,
        is_active: template.is_active
      });
      
      setTemplates(templates.map(t => t.id === template.id ? updated : t));
      setEditingTemplate(null);
      setSuccess('Plantilla guardada exitosamente');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Error al guardar la plantilla');
    } finally {
      setSaving(null);
    }
  };

  const getTemplateTypeLabel = (type: string) => {
    const labels = {
      'order_created': 'Orden Creada',
      'order_updated': 'Estado Actualizado',
      'verification_link': 'Enlace de Verificación',
      'order_completed': 'Traducción Completada',
      'order_delivered': 'Orden Entregada'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTemplateTypeColor = (type: string) => {
    const colors = {
      'order_created': 'bg-blue-100 text-blue-800 border-blue-200',
      'order_updated': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'verification_link': 'bg-purple-100 text-purple-800 border-purple-200',
      'order_completed': 'bg-green-100 text-green-800 border-green-200',
      'order_delivered': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderPreview = (template: EmailTemplate) => {
    const sampleVariables = {
      client_name: 'María García',
      order_id: '12345678',
      source_language: 'Español',
      target_language: 'Inglés',
      processing_time: '5',
      status: 'En Proceso',
      progress: '75',
      verification_url: 'https://example.com/verificar/abc123',
      status_message: 'Su traducción está progresando según lo programado.'
    };

    const content = previewMode === 'html' ? template.html_content : template.text_content;
    const processedContent = EmailTemplateService.replaceVariables(content, sampleVariables);

    if (previewMode === 'html') {
      return (
        <div 
          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white max-h-96 overflow-auto"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      );
    } else {
      return (
        <pre className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 text-sm max-h-96 overflow-auto whitespace-pre-wrap">
          {processedContent}
        </pre>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Cargando plantillas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Plantillas de Email
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Gestiona las plantillas de correo electrónico del sistema</p>
        </div>
        <button
          onClick={loadTemplates}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-xl">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">{success}</p>
        </div>
      )}

      {/* Templates List */}
      <div className="grid grid-cols-1 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{template.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTemplateTypeColor(template.type)}`}>
                      {getTemplateTypeLabel(template.type)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={template.is_active}
                      onChange={(e) => {
                        const updated = { ...template, is_active: e.target.checked };
                        handleSaveTemplate(updated);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Activo</span>
                  </label>
                  <button
                    onClick={() => setEditingTemplate(editingTemplate?.id === template.id ? null : template)}
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{editingTemplate?.id === template.id ? 'Cancelar' : 'Editar'}</span>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Asunto:</strong> {template.subject}
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable) => (
                    <span key={variable} className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      #{variable}
                    </span>
                  ))}
                </div>
              </div>

              {editingTemplate?.id === template.id && (
                <EditTemplateForm
                  template={editingTemplate}
                  onSave={handleSaveTemplate}
                  onCancel={() => setEditingTemplate(null)}
                  saving={saving === template.id}
                  onTemplateChange={setEditingTemplate}
                />
              )}

              {editingTemplate?.id !== template.id && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white">Vista Previa</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPreviewMode('html')}
                        className={`px-3 py-1 text-xs rounded ${previewMode === 'html' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        <Code className="w-3 h-3 inline mr-1" />
                        HTML
                      </button>
                      <button
                        onClick={() => setPreviewMode('text')}
                        className={`px-3 py-1 text-xs rounded ${previewMode === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      >
                        Texto
                      </button>
                    </div>
                  </div>
                  {renderPreview(template)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface EditTemplateFormProps {
  template: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
  saving: boolean;
  onTemplateChange: (template: EmailTemplate) => void;
}

function EditTemplateForm({ template, onSave, onCancel, saving, onTemplateChange }: EditTemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template.name,
    subject: template.subject,
    html_content: template.html_content,
    text_content: template.text_content,
    is_active: template.is_active
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...template, ...formData });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Update the editing template in real-time for preview
    onTemplateChange({ ...template, ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nombre de la Plantilla
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center pt-8">
          <input
            type="checkbox"
            id={`active-${template.id}`}
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={`active-${template.id}`} className="ml-2 block text-sm text-gray-900 dark:text-white">
            Plantilla activa
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Asunto del Email
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Contenido HTML
        </label>
        <textarea
          name="html_content"
          value={formData.html_content}
          onChange={handleInputChange}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Contenido de Texto Plano
        </label>
        <textarea
          name="text_content"
          value={formData.text_content}
          onChange={handleInputChange}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Guardando...' : 'Guardar Plantilla'}</span>
        </button>
      </div>
    </form>
  );
}