// components/ui/Input.jsx - Input component with validation and variants

import React, { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Input component with validation, icons, and different variants
 * @param {Object} props - Component props
 * @param {'text'|'email'|'password'|'number'|'tel'|'url'|'search'} props.type - Input type
 * @param {'sm'|'md'|'lg'} props.size - Input size
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {boolean} props.readonly - Whether input is readonly
 * @param {boolean} props.required - Whether input is required
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.label - Input label
 * @param {string} props.helperText - Helper text below input
 * @param {string} props.error - Error message
 * @param {React.ReactNode} props.leftIcon - Icon on the left side
 * @param {React.ReactNode} props.rightIcon - Icon on the right side
 * @param {Function} props.onRightIconClick - Click handler for right icon
 * @param {boolean} props.fullWidth - Whether input takes full width
 * @param {string} props.className - Additional CSS classes
 */
export const Input = forwardRef(({
  type = 'text',
  size = 'md',
  disabled = false,
  readonly = false,
  required = false,
  placeholder,
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  onRightIconClick,
  fullWidth = false,
  className,
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm', 
    lg: 'px-4 py-3 text-base'
  };

  // Base input styles
  const inputStyles = cn(
    'block w-full rounded-lg border transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    
    // Default state
    'border-gray-300 bg-white text-gray-900',
    'dark:border-gray-600 dark:bg-gray-700 dark:text-white',
    
    // Hover state
    'hover:border-gray-400 dark:hover:border-gray-500',
    
    // Error state
    error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
    
    // Disabled state
    disabled && [
      'bg-gray-50 text-gray-500 cursor-not-allowed',
      'dark:bg-gray-800 dark:text-gray-400',
      'hover:border-gray-300 dark:hover:border-gray-600'
    ],
    
    // Readonly state
    readonly && 'bg-gray-50 dark:bg-gray-800 cursor-default',
    
    // Icon padding
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    
    // Size
    sizeStyles[size],
    
    // Full width
    fullWidth && 'w-full'
  );

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine actual input type
  const actualType = type === 'password' && showPassword ? 'text' : type;

  // Password visibility icon
  const passwordIcon = showPassword ? (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a11.05 11.05 0 01-4.553 5.62m-2.509 1.1A11.027 11.027 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 013.27-5.146" />
    </svg>
  );

  return (
    <div className={cn('space-y-1', fullWidth && 'w-full', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium text-gray-700 dark:text-gray-300',
            required && "after:content-['*'] after:ml-0.5 after:text-red-500"
          )}
        >
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 dark:text-gray-500">
              {leftIcon}
            </span>
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          type={actualType}
          disabled={disabled}
          readOnly={readonly}
          required={required}
          placeholder={placeholder}
          className={inputStyles}
          {...props}
        />

        {/* Right Icon */}
        {(rightIcon || type === 'password') && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {type === 'password' ? (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {passwordIcon}
              </button>
            ) : rightIcon ? (
              <span
                className={cn(
                  'text-gray-400 dark:text-gray-500',
                  onRightIconClick && 'cursor-pointer hover:text-gray-600 dark:hover:text-gray-300'
                )}
                onClick={onRightIconClick}
              >
                {rightIcon}
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <p className={cn(
          'text-xs',
          error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea component
export const Textarea = forwardRef(({
  size = 'md',
  rows = 4,
  disabled = false,
  readonly = false,
  required = false,
  label,
  helperText,
  error,
  fullWidth = false,
  className,
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const textareaStyles = cn(
    'block w-full rounded-lg border transition-colors duration-200 resize-vertical',
    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    
    // Default state
    'border-gray-300 bg-white text-gray-900',
    'dark:border-gray-600 dark:bg-gray-700 dark:text-white',
    
    // Hover state
    'hover:border-gray-400 dark:hover:border-gray-500',
    
    // Error state
    error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
    
    // Disabled state
    disabled && [
      'bg-gray-50 text-gray-500 cursor-not-allowed resize-none',
      'dark:bg-gray-800 dark:text-gray-400',
      'hover:border-gray-300 dark:hover:border-gray-600'
    ],
    
    // Readonly state
    readonly && 'bg-gray-50 dark:bg-gray-800 cursor-default resize-none',
    
    // Size
    sizeStyles[size],
    
    // Full width
    fullWidth && 'w-full'
  );

  return (
    <div className={cn('space-y-1', fullWidth && 'w-full', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={textareaId}
          className={cn(
            'block text-sm font-medium text-gray-700 dark:text-gray-300',
            required && "after:content-['*'] after:ml-0.5 after:text-red-500"
          )}
        >
          {label}
        </label>
      )}

      {/* Textarea */}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        readOnly={readonly}
        required={required}
        className={textareaStyles}
        {...props}
      />

      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <p className={cn(
          'text-xs',
          error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Search Input component
export const SearchInput = forwardRef(({
  onSearch,
  onClear,
  placeholder = "Search...",
  className,
  ...props
}, ref) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch?.(newValue);
  };

  const handleClear = () => {
    setValue('');
    onSearch?.('');
    onClear?.();
  };

  const searchIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const clearIcon = value ? (
    <svg 
      className="w-5 h-5 cursor-pointer" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      onClick={handleClear}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ) : null;

  return (
    <Input
      ref={ref}
      type="search"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      leftIcon={searchIcon}
      rightIcon={clearIcon}
      onRightIconClick={clearIcon ? handleClear : undefined}
      className={className}
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';

// Number Input component with increment/decrement buttons
export const NumberInput = forwardRef(({
  min,
  max,
  step = 1,
  value,
  onChange,
  className,
  ...props
}, ref) => {
  const handleIncrement = () => {
    const newValue = (parseFloat(value) || 0) + step;
    if (max === undefined || newValue <= max) {
      onChange?.({ target: { value: newValue.toString() } });
    }
  };

  const handleDecrement = () => {
    const newValue = (parseFloat(value) || 0) - step;
    if (min === undefined || newValue >= min) {
      onChange?.({ target: { value: newValue.toString() } });
    }
  };

  const incrementIcon = (
    <button
      type="button"
      onClick={handleIncrement}
      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
      tabIndex={-1}
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );

  return (
    <div className="relative">
      <Input
        ref={ref}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={cn('pr-8', className)}
        {...props}
      />
      <div className="absolute inset-y-0 right-0 flex flex-col justify-center pr-1">
        <button
          type="button"
          onClick={handleIncrement}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
});

NumberInput.displayName = 'NumberInput';

export default Input;