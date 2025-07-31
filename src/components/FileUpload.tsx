import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, File, X, CheckCircle, AlertCircle, Cloud } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  currentFile?: string;
  loading?: boolean;
}

export function FileUpload({ 
  onFileSelect, 
  multiple = false,
  accept = ".pdf,.doc,.docx,.txt", 
  maxSize = 10,
  currentFile,
  loading = false
}: FileUploadProps) {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      validateAndSelectFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files[0]) {
      validateAndSelectFile(files[0]);
    }
  };

  const validateAndSelectFile = (file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(t('fileUpload.fileTooLarge', { size: maxSize }));
      return;
    }

    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!acceptedTypes.some(type => type === fileExtension || file.type.includes(type.replace('.', '')))) {
      setError(t('fileUpload.invalidType', { types: accept }));
      return;
    }

    onFileSelect(file);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-500 transform ${
          dragActive
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 scale-105 shadow-xl'
            : currentFile
            ? 'border-green-400 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 shadow-lg'
            : 'border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:border-blue-400 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 hover:shadow-lg'
        } ${loading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {loading ? (
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
              <Cloud className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          ) : currentFile ? (
            <div className="relative">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          ) : (
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              dragActive ? 'bg-blue-100 dark:bg-blue-900 scale-110' : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Upload className={`w-8 h-8 transition-all duration-300 ${
                dragActive ? 'text-blue-600 animate-bounce' : 'text-gray-400'
              }`} />
            </div>
          )}
          
          <div>
            <p className={`text-xl font-bold transition-all duration-300 ${
              dragActive ? 'text-blue-600' : currentFile ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {loading ? t('fileUpload.uploading') : currentFile ? t('fileUpload.fileLoaded') : t('fileUpload.dragHere')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
              {currentFile ? currentFile : t('fileUpload.clickToSelect') + ` (${t('fileUpload.supportedTypes', { types: accept })}, ${t('fileUpload.maxSize', { size: maxSize })})`}
            </p>
          </div>
        </div>

        {dragActive && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl animate-pulse">
              {t('fileUpload.dropHere')}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-3 text-red-600 dark:text-red-400 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-4 py-3 rounded-xl border border-red-200 dark:border-red-700 shadow-sm animate-shake">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}