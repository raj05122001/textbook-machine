// components/ui/Dropdown.jsx - Dropdown select component

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
  size = 'md',
  label,
  error,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between rounded-lg border transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
          'bg-white text-gray-900 border-gray-300',
          'dark:bg-gray-700 dark:text-white dark:border-gray-600',
          'hover:border-gray-400 dark:hover:border-gray-500',
          error && 'border-red-500 focus:ring-red-500',
          disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed dark:bg-gray-800',
          sizeStyles[size]
        )}
        {...props}
      >
        <span className={selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={cn('w-5 h-5 text-gray-400 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={cn(
                'w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors',
                'first:rounded-t-lg last:rounded-b-lg',
                value === option.value && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
