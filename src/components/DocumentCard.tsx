import React from 'react';
import { Download, FileText, Upload, Calendar, Plus } from 'lucide-react';

interface DocumentCardProps {
  title: string;
  documents?: (string | null)[];
  uploadDate?: string;
  wordCount?: number;
  fileType?: string;
  onUpload?: () => void;
  onDownload?: () => void;
  showUpload?: boolean;
  isEmpty?: boolean;
}

export function DocumentCard({
  title,
  documents = [],
  uploadDate,
  wordCount,
  fileType,
  onUpload,
  onDownload,
  showUpload = false,
  isEmpty = true
}: DocumentCardProps) {
  
  // Parse and validate documents from Supabase JSON fields
  const validDocuments = React.useMemo(() => {
    console.log(`=== DocumentCard [${title}] PARSING START ===`);
    console.log('Raw documents received:', documents);
    console.log('Type:', typeof documents);
    console.log('Is array:', Array.isArray(documents));
    
    if (!documents) {
      console.log('No documents found');
      return [];
    }
    
    let processedDocs: string[] = [];
    
    // If documents is not an array, try to make it one
    const docsArray = Array.isArray(documents) ? documents : [documents];
    console.log('Processing documents array:', docsArray);
    
    for (let i = 0; i < docsArray.length; i++) {
      const doc = docsArray[i];
      console.log(`Processing doc ${i}:`, doc, typeof doc);
      
      if (typeof doc === 'string') {
        const trimmedDoc = doc.trim();
        
        // Check if it's a JSON array string like ["url1", "url2"]
        if (trimmedDoc.startsWith('[') && trimmedDoc.endsWith(']')) {
          try {
            console.log('Attempting to parse JSON array:', trimmedDoc);
            const parsed = JSON.parse(trimmedDoc);
            console.log('Successfully parsed:', parsed);
            
            if (Array.isArray(parsed)) {
              processedDocs.push(...parsed.filter(url => url && typeof url === 'string'));
              console.log('Added URLs from parsed array:', parsed);
            }
          } catch (e) {
            console.log('Failed to parse as JSON, treating as regular string:', e);
            // If parsing fails, treat as regular string
            if (trimmedDoc.startsWith('http') || trimmedDoc.startsWith('blob:')) {
              processedDocs.push(trimmedDoc);
            }
          }
        }
        // Check if it's a single URL
        else if (trimmedDoc.startsWith('http') || trimmedDoc.startsWith('blob:')) {
          console.log('Found direct URL:', trimmedDoc);
          processedDocs.push(trimmedDoc);
        } else {
          console.log('String is not a recognizable URL format:', trimmedDoc);
        }
      } else {
        console.log('Document is not a string, skipping:', typeof doc);
      }
    }
    
    console.log('Final processed documents:', processedDocs);
    console.log(`=== DocumentCard [${title}] PARSING END ===`);
    return processedDocs;
  }, [documents]);

  const hasValidDocuments = validDocuments.length > 0;
  
  // Debug logging
  React.useEffect(() => {
    console.log(`DocumentCard [${title}] - Final state:`, {
      documents,
      validDocuments,
      hasValidDocuments,
      documentsLength: validDocuments.length
    });
  }, [title, documents, validDocuments, hasValidDocuments]);

  const getFileIcon = (url?: string) => {
    if (!url) return '📄';
    
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'docx':
      case 'doc':
        return '📝';
      case 'txt':
        return '📃';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      default:
        return '📄';
    }
  };

  const extractFileName = (url: string) => {
    if (!url || typeof url !== 'string') return 'documento';
    
    try {
      // Extract filename from URL
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      
      // Remove timestamp and UUID prefix (e.g., "1753556744983-836d2f43-8d63-4a38-8392-c1e81b3e9d2c-")
      const cleanFilename = filename.replace(/^\d+-[a-f0-9-]+-/, '');
      
      return cleanFilename || filename;
    } catch (error) {
      console.error('Error extracting filename:', error);
      return 'documento';
    }
  };

  const getFileExtension = (url: string) => {
    const filename = extractFileName(url);
    return filename.split('.').pop()?.toLowerCase() || 'pdf';
  };

  const formatFileSize = (index: number) => {
    // Mock file sizes for display - in real app you'd get this from metadata
    const sizes = ['2.3 MB', '1.8 MB', '3.1 MB', '875 KB', '4.2 MB'];
    return sizes[index % sizes.length];
  };

  console.log(`DocumentCard RENDER [${title}]:`, {
    hasValidDocuments,
    validDocumentsCount: validDocuments.length,
    showUpload,
    isEmpty
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {hasValidDocuments && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {validDocuments.length} archivo{validDocuments.length > 1 ? 's' : ''}
            </span>
            <span className="text-2xl">{getFileIcon(validDocuments[0])}</span>
          </div>
        )}
      </div>

      {!hasValidDocuments ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {showUpload ? 'No hay documentos traducidos' : 'No hay documentos originales'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            Debug: {JSON.stringify({ documentsReceived: documents, validCount: validDocuments.length })}
          </p>
          {showUpload && onUpload && (
            <button
              onClick={onUpload}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Documento</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Display all documents */}
          {validDocuments.map((url, index) => {
            const fileName = extractFileName(url);
            const fileExt = getFileExtension(url);
            return (
              <div 
                key={`${url}-${index}`} 
                className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{getFileIcon(url)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={fileName}>
                    {fileName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {fileExt.toUpperCase()} • {formatFileSize(index)} • Archivo {index + 1} de {validDocuments.length}
                  </p>
                  {uploadDate && index === 0 && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>Subido el {new Date(uploadDate).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(url, '_blank')}
                    className="flex items-center space-x-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-xs font-medium"
                  >
                    <Download className="w-3 h-3" />
                    <span>Descargar</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Upload more files button */}
          {showUpload && onUpload && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onUpload}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm font-medium w-full justify-center"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar más archivos</span>
              </button>
            </div>
          )}

          {/* Summary info */}
          {wordCount && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Total:</strong> {validDocuments.length} archivo{validDocuments.length > 1 ? 's' : ''} • {wordCount.toLocaleString()} palabras
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}