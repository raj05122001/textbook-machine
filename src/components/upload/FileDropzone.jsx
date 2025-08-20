// components/upload/FileDropzone.jsx - Drag & drop file upload component

import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { FILE_CONFIG } from '@/lib/constants';
import { formatBytes } from '@/lib/formatters';

/**
 * File Dropzone component with drag & drop functionality
 * @param {Function} onFilesSelected - Callback when files are selected
 * @param {Array} acceptedTypes - Array of accepted file extensions
 * @param {number} maxFiles - Maximum number of files allowed
 * @param {number} maxSize - Maximum file size in bytes
 * @param {boolean} multiple - Whether multiple files are allowed
 * @param {boolean} disabled - Whether dropzone is disabled
 * @param {string} className - Additional CSS classes
 */
export const FileDropzone = ({
  onFilesSelected,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt'],
  maxFiles = FILE_CONFIG.maxFiles,
  maxSize = FILE_CONFIG.maxSize,
  multiple = true,
  disabled = false,
  className,
  ...props
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const files = Array.from(e.dataTransfer.items);
      const hasInvalidFiles = files.some(item => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          return !isValidFile(file);
        }
        return false;
      });
      
      setIsDragActive(true);
      setIsDragReject(hasInvalidFiles);
    }
  }, [disabled]);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setIsDragActive(false);
    setIsDragReject(false);
  }, [disabled]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragActive(false);
    setIsDragReject(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  }, [disabled]);

  // Validate file
  const isValidFile = useCallback((file) => {
    if (!file) return false;
    
    // Check file size
    if (file.size > maxSize) return false;
    
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) return false;
    
    return true;
  }, [acceptedTypes, maxSize]);

  // Handle file selection
  const handleFiles = useCallback((files) => {
    const validFiles = files.filter(isValidFile);
    
    // Limit number of files
    const filesToProcess = multiple 
      ? validFiles.slice(0, maxFiles)
      : validFiles.slice(0, 1);
    
    if (filesToProcess.length > 0) {
      onFilesSelected?.(filesToProcess);
    }
  }, [isValidFile, multiple, maxFiles, onFilesSelected]);

  // Handle file input change
  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
    // Reset input value to allow selecting same file again
    e.target.value = '';
  }, [handleFiles]);

  // Open file dialog
  const openFileDialog = useCallback(() => {
    if (!disabled) {
      document.getElementById('file-upload')?.click();
    }
  }, [disabled]);

  const dropzoneClasses = cn(
    // Base styles
    'relative border-2 border-dashed rounded-xl transition-all duration-300',
    'flex flex-col items-center justify-center p-8 min-h-[200px]',
    'cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500',
    
    // Default state
    'border-gray-300 bg-gray-50/50 hover:bg-gray-50',
    'dark:border-gray-600 dark:bg-gray-800/30 dark:hover:bg-gray-800/50',
    
    // Active drag state
    isDragActive && !isDragReject && [
      'border-emerald-400 bg-emerald-50',
      'dark:border-emerald-500 dark:bg-emerald-900/20'
    ],
    
    // Reject drag state
    isDragReject && [
      'border-red-400 bg-red-50',
      'dark:border-red-500 dark:bg-red-900/20'
    ],
    
    // Disabled state
    disabled && [
      'cursor-not-allowed opacity-50',
      'border-gray-200 bg-gray-100',
      'dark:border-gray-700 dark:bg-gray-900'
    ],
    
    className
  );

  return (
    <div
      className={dropzoneClasses}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={openFileDialog}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFileDialog();
        }
      }}
      {...props}
    >
      {/* Hidden file input */}
      <input
        id="file-upload"
        type="file"
        className="hidden"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        disabled={disabled}
      />

      {/* Upload icon */}
      <div className={cn(
        'w-12 h-12 mb-4 rounded-full flex items-center justify-center',
        'bg-emerald-100 text-emerald-600',
        'dark:bg-emerald-900/30 dark:text-emerald-400',
        isDragReject && 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
      )}>
        {isDragActive ? (
          isDragReject ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          )
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        )}
      </div>

      {/* Upload text */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
          {isDragActive
            ? isDragReject
              ? 'Some files are not supported'
              : 'Drop files here'
            : 'Drop files here or click to browse'
          }
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {multiple ? `Select up to ${maxFiles} files` : 'Select a file'}
        </p>
        
        {/* File requirements */}
        <div className="space-y-1 text-xs text-gray-400 dark:text-gray-500">
          <p>Supported formats: {acceptedTypes.join(', ')}</p>
          <p>Maximum file size: {formatBytes(maxSize)}</p>
        </div>
      </div>

      {/* Browse button */}
      <button
        type="button"
        className={cn(
          'mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg',
          'hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500',
          'transition-colors duration-200',
          disabled && 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'
        )}
        onClick={(e) => {
          e.stopPropagation();
          openFileDialog();
        }}
        disabled={disabled}
      >
        Browse Files
      </button>
    </div>
  );
};