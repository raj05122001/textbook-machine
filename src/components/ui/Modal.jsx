// components/ui/Modal.jsx - Modal dialog component for TBM

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

/**
 * Modal component with backdrop, animations, and accessibility
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Function called when modal should close
 * @param {React.ReactNode} props.children - Modal content
 * @param {'sm'|'md'|'lg'|'xl'|'full'} props.size - Modal size
 * @param {boolean} props.closeOnBackdrop - Whether clicking backdrop closes modal
 * @param {boolean} props.closeOnEscape - Whether ESC key closes modal
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.footer - Modal footer content
 * @param {boolean} props.showCloseButton - Whether to show X close button
 * @param {string} props.className - Additional CSS classes
 */
export const Modal = ({
  isOpen = false,
  onClose,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  title,
  footer,
  showCloseButton = true,
  className,
  ...props
}) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Size variants
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (closeOnEscape && event.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement;
      
      // Focus modal when opened
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus when closed
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (closeOnBackdrop && event.target === backdropRef.current) {
      onClose?.();
    }
  };

  // Trap focus within modal
  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    }
  };

  // Don't render if not open
  if (!isOpen) return null;

  // Modal content
  const modalContent = (
    <div
      ref={backdropRef}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black/50 backdrop-blur-sm',
        'animate-in fade-in duration-200'
      )}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={cn(
          'relative w-full mx-4 my-8',
          'bg-white dark:bg-gray-800',
          'rounded-lg shadow-xl',
          'animate-in zoom-in-95 duration-200',
          'focus:outline-none',
          'max-h-[calc(100vh-2rem)] overflow-hidden',
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button
                type="button"
                className={cn(
                  'rounded-lg p-1.5 text-gray-400',
                  'hover:bg-gray-100 hover:text-gray-500',
                  'dark:hover:bg-gray-700 dark:hover:text-gray-300',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500'
                )}
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render modal in portal
  return createPortal(modalContent, document.body);
};

// Confirmation modal component
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  ...props
}) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onClose?.();
  };

  const Button = ({ children, variant: btnVariant = 'primary', ...btnProps }) => (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        btnVariant === 'primary' && 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
        btnVariant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        btnVariant === 'secondary' && 'bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500'
      )}
      {...btnProps}
    >
      {children}
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </>
      }
      {...props}
    >
      <p className="text-gray-600 dark:text-gray-300">{message}</p>
    </Modal>
  );
};

// Alert modal component
export const AlertModal = ({
  isOpen,
  onClose,
  title = "Alert",
  message,
  type = "info",
  buttonText = "OK",
  ...props
}) => {
  const typeIcons = {
    info: (
      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.966-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <button
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onClick={onClose}
        >
          {buttonText}
        </button>
      }
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {typeIcons[type]}
        </div>
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </Modal>
  );
};

// Loading modal component
export const LoadingModal = ({
  isOpen,
  title = "Loading...",
  message = "Please wait while we process your request.",
  progress,
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      closeOnBackdrop={false}
      closeOnEscape={false}
      showCloseButton={false}
      title={title}
      size="sm"
      {...props}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <svg
            className="animate-spin h-8 w-8 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
        
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Modal;