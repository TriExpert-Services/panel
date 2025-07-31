import React, { useState, useEffect } from 'react';
import { Mail, Edit, Save, Eye, RefreshCw, Code, Plus, Trash2, AlertCircle, Copy, Check } from 'lucide-react';
import { EmailTemplate, EmailTemplateService } from '../lib/api';

export function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [previewMode, setPreviewMode] = useState<'html' | 'text'>('html');
  const [showVariableHelper, setShowVariableHelper] = useState(false);

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
      let updated;
      if (creatingNew) {
        // Create new template
        const { id, created_at, updated_at, ...templateData } = template;
        updated = await EmailTemplateService.createTemplate(templateData);
        setTemplates([updated, ...templates]);
        setCreatingNew(false);
      } else {
        // Update existing template
        updated = await EmailTemplateService.updateTemplate(template.id, {
          name: template.name,
          subject: template.subject,
          html_content: template.html_content,
          text_content: template.text_content,
          is_active: template.is_active
        });
        setTemplates(templates.map(t => t.id === template.id ? updated : t));
      }
      
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

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) return;
    
    try {
      await EmailTemplateService.deleteTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
      setSuccess('Plantilla eliminada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting template:', err);
      setError('Error al eliminar la plantilla');
    }
  };

  const createNewTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: 'new-' + Date.now(),
      name: 'Nueva Plantilla',
      type: 'order_created',
      subject: '#{client_name} - Su orden #{order_id}',
      html_content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>#{subject}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 20px; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
        }
        .content { 
            padding: 30px; 
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .button { 
            display: inline-block; 
            background: #28a745; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Translation Services</h1>
            <p>Su servicio de traducción profesional</p>
        </div>
        <div class="content">
            <p>Estimado/a <strong>#{client_name}</strong>,</p>
            
            <p>Este es el contenido de su plantilla personalizada.</p>
            
            <p><strong>Orden:</strong> #{order_id}</p>
            <p><strong>De:</strong> #{source_language} <strong>A:</strong> #{target_language}</p>
            <p><strong>Estado:</strong> #{status}</p>
            
            <a href="#{verification_url}" class="button">Ver Estado de Traducción</a>
            
            <p>Saludos cordiales,<br>
            <strong>Equipo de Translation Services</strong></p>
        </div>
        <div class="footer">
            <p>© 2024 Translation Services. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>`,
      text_content: `Estimado/a #{client_name},

Este es el contenido de texto plano de su plantilla personalizada.

Orden: #{order_id}
De: #{source_language} A: #{target_language}
Estado: #{status}

Ver estado de traducción: #{verification_url}

Saludos cordiales,
Equipo de Translation Services

© 2024 Translation Services. Todos los derechos reservados.`,
      variables: EmailTemplateService.getAvailableVariables(),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setEditingTemplate(newTemplate);
    setCreatingNew(true);
  };

  const getTemplateTypeLabel = (type: string) => {
    const types = EmailTemplateService.getTemplateTypes();
    return types.find(t => t.value === type)?.label || type;
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
        <pre className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 text-sm max-h-96 overflow-auto whitespace-pre-wrap text-gray-800 dark:text-gray-200">
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
        <div className="flex space-x-3">
          <button
            onClick={createNewTemplate}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Plantilla</span>
          </button>
          <button
            onClick={loadTemplates}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700 rounded-xl">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-xl">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Variable Helper */}
      {showVariableHelper && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">Variables Disponibles</h3>
            <button
              onClick={() => setShowVariableHelper(false)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {EmailTemplateService.getAvailableVariables().map((variable) => (
              <div
                key={variable}
                className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3 border border-blue-200 dark:border-blue-600"
              >
                <code className="text-sm font-mono text-blue-800 dark:text-blue-300">#{variable}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(`#{${variable}}`)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
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
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
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
                  onCancel={() => {
                    setEditingTemplate(null);
                    setCreatingNew(false);
                  }}
                  saving={saving === template.id}
                  onTemplateChange={setEditingTemplate}
                  showVariableHelper={() => setShowVariableHelper(true)}
                  isCreating={creatingNew}
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
  showVariableHelper: () => void;
  isCreating: boolean;
}

function EditTemplateForm({ template, onSave, onCancel, saving, onTemplateChange, showVariableHelper, isCreating }: EditTemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template.name,
    type: template.type,
    subject: template.subject,
    html_content: template.html_content,
    text_content: template.text_content,
    is_active: template.is_active
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'html' | 'text' | 'preview'>('basic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...template, ...formData });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };
    
    setFormData(newFormData);

    // Update the editing template in real-time for preview
    onTemplateChange({ ...template, ...newFormData });
  };

  const insertVariable = (variable: string) => {
    const textarea = document.activeElement as HTMLTextAreaElement;
    if (textarea && (textarea.name === 'html_content' || textarea.name === 'text_content' || textarea.name === 'subject')) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newValue = before + `#{${variable}}` + after;
      
      setFormData({
        ...formData,
        [textarea.name]: newValue
      });
      
      onTemplateChange({ 
        ...template, 
        ...formData, 
        [textarea.name]: newValue 
      });
    }
  };

  const renderPreview = () => {
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

    const processedHtml = EmailTemplateService.replaceVariables(formData.html_content, sampleVariables);
    const processedText = EmailTemplateService.replaceVariables(formData.text_content, sampleVariables);

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Vista Previa HTML</h4>
          <div 
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white max-h-64 overflow-auto"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Vista Previa Texto</h4>
          <pre className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 text-sm max-h-64 overflow-auto whitespace-pre-wrap text-gray-800 dark:text-gray-200">
            {processedText}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'basic', label: 'Información Básica', icon: Edit },
            { id: 'html', label: 'Contenido HTML', icon: Code },
            { id: 'text', label: 'Contenido Texto', icon: Mail },
            { id: 'preview', label: 'Vista Previa', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'basic' && (
          <div className="space-y-4">
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
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Plantilla
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  {EmailTemplateService.getTemplateTypes().map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Asunto del Email
                </label>
                <button
                  type="button"
                  onClick={showVariableHelper}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Ver Variables
                </button>
              </div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Asunto del email con variables como #{client_name}"
                required
              />
            </div>

            <div className="flex items-center">
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
        )}

        {activeTab === 'html' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Contenido HTML
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={showVariableHelper}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Ver Variables
                </button>
              </div>
            </div>
            <textarea
              name="html_content"
              value={formData.html_content}
              onChange={handleInputChange}
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              placeholder="Contenido HTML del email..."
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 Tip: Usa variables como #{client_name}, #{order_id}, #{verification_url}, etc.
            </p>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Contenido de Texto Plano
              </label>
              <button
                type="button"
                onClick={showVariableHelper}
                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Ver Variables
              </button>
            </div>
            <textarea
              name="text_content"
              value={formData.text_content}
              onChange={handleInputChange}
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              placeholder="Contenido de texto plano del email..."
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              💡 Tip: Esta versión se usa como fallback para clientes de email que no soportan HTML.
            </p>
          </div>
        )}

        {activeTab === 'preview' && renderPreview()}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Guardando...' : isCreating ? 'Crear Plantilla' : 'Guardar Cambios'}</span>
        </button>
      </div>
    </form>
  );
}