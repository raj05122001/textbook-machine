// components/upload/FilePreview.jsx - File preview and management component

import { formatBytes, getFileExtension } from '@/lib/formatters';
import { LoadingSpinner } from '@/components/ui';

/**
 * File Preview component to display selected files
 * @param {Array} files - Array of file objects
 * @param {Function} onRemove - Callback to remove a file
 * @param {boolean} readonly - Whether files can be removed
 * @param {string} className - Additional CSS classes
 */
export const FilePreview = ({
  files = [],
  onRemove,
  readonly = false,
  className,
  ...props
}) => {
  if (!files || files.length === 0) {
    return null;
  }

  // Get file type icon
  const getFileIcon = (filename) => {
    const extension = getFileExtension(filename);
    const iconClasses = "w-8 h-8";
    
    switch (extension) {
      case 'pdf':
        return (
          <div className={cn("bg-red-100 text-red-600 rounded-lg p-2", iconClasses)}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'doc':
      case 'docx':
        return (
          <div className={cn("bg-blue-100 text-blue-600 rounded-lg p-2", iconClasses)}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'txt':
        return (
          <div className={cn("bg-gray-100 text-gray-600 rounded-lg p-2", iconClasses)}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={cn("bg-gray-100 text-gray-600 rounded-lg p-2", iconClasses)}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  // Get status indicator
  const getStatusIndicator = (file) => {
    switch (file.status) {
      case 'uploading':
        return <LoadingSpinner size="sm" />;
      case 'completed':
        return (
          <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-3', className)} {...props}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Selected Files ({files.length})
      </h3>
      
      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={file.id || index}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border',
              'bg-white dark:bg-gray-800',
              'border-gray-200 dark:border-gray-700',
              'hover:border-gray-300 dark:hover:border-gray-600',
              'transition-colors duration-200'
            )}
          >
            {/* File icon */}
            {getFileIcon(file.name)}
            
            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {file.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatBytes(file.size)}
                </p>
                {file.status && (
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    file.status === 'completed' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                    file.status === 'uploading' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
                    file.status === 'error' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  )}>
                    {file.status}
                  </span>
                )}
              </div>
              
              {/* Progress bar for uploading files */}
              {file.status === 'uploading' && file.progress !== undefined && (
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
              
              {/* Error message */}
              {file.status === 'error' && file.error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {file.error}
                </p>
              )}
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              {getStatusIndicator(file)}
              
              {/* Remove button */}
              {!readonly && onRemove && (
                <button
                  onClick={() => onRemove(file.id || index)}
                  className={cn(
                    'p-1 rounded-full text-gray-400 hover:text-gray-600',
                    'dark:text-gray-500 dark:hover:text-gray-300',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    'transition-colors duration-200'
                  )}
                  aria-label="Remove file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};