// components/ui/Button.jsx - Versatile button component for TBM

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Button component with multiple variants, sizes, and states
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'|'success'} props.variant - Button style variant
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} props.size - Button size
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {React.ReactNode} props.icon - Icon element to display
 * @param {'left'|'right'} props.iconPosition - Position of icon
 * @param {'button'|'submit'|'reset'} props.type - Button type
 * @param {boolean} props.fullWidth - Whether button takes full width
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 */
export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  type = 'button',
  fullWidth = false,
  className,
  onClick,
  ...props
}, ref) => {
  // Base button styles
  const baseStyles = cn(
    // Layout and positioning
    'inline-flex items-center justify-center',
    'relative overflow-hidden',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed',
    
    // Typography
    'font-medium text-sm leading-5',
    'whitespace-nowrap',
    
    // Border and shape
    'border rounded-lg',
    
    // Full width option
    fullWidth && 'w-full',
    
    // Loading state
    loading && 'cursor-wait',
    
    // Disabled state
    disabled && 'opacity-50 cursor-not-allowed'
  );

  // Variant styles
  const variantStyles = {
    primary: cn(
      'bg-emerald-600 text-white border-emerald-600',
      'hover:bg-emerald-700 hover:border-emerald-700',
      'focus:ring-emerald-500',
      'active:bg-emerald-800',
      disabled && 'hover:bg-emerald-600 hover:border-emerald-600'
    ),
    secondary: cn(
      'bg-gray-600 text-white border-gray-600',
      'hover:bg-gray-700 hover:border-gray-700',
      'focus:ring-gray-500',
      'active:bg-gray-800',
      disabled && 'hover:bg-gray-600 hover:border-gray-600'
    ),
    outline: cn(
      'bg-transparent text-emerald-600 border-emerald-600',
      'hover:bg-emerald-50 hover:text-emerald-700',
      'focus:ring-emerald-500',
      'active:bg-emerald-100',
      'dark:text-emerald-400 dark:border-emerald-400',
      'dark:hover:bg-emerald-900/20 dark:hover:text-emerald-300',
      disabled && 'hover:bg-transparent hover:text-emerald-600'
    ),
    ghost: cn(
      'bg-transparent text-gray-700 border-transparent',
      'hover:bg-gray-100 hover:text-gray-900',
      'focus:ring-gray-500',
      'active:bg-gray-200',
      'dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
      disabled && 'hover:bg-transparent hover:text-gray-700'
    ),
    danger: cn(
      'bg-red-600 text-white border-red-600',
      'hover:bg-red-700 hover:border-red-700',
      'focus:ring-red-500',
      'active:bg-red-800',
      disabled && 'hover:bg-red-600 hover:border-red-600'
    ),
    success: cn(
      'bg-green-600 text-white border-green-600',
      'hover:bg-green-700 hover:border-green-700',
      'focus:ring-green-500',
      'active:bg-green-800',
      disabled && 'hover:bg-green-600 hover:border-green-600'
    )
  };

  // Size styles
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs min-h-[24px]',
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-6 py-2.5 text-base min-h-[44px]',
    xl: 'px-8 py-3 text-lg min-h-[48px]'
  };

  // Handle click events
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4 mr-2"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
  );

  // Combine all styles
  const buttonClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {/* Loading state */}
      {loading && <LoadingSpinner />}
      
      {/* Icon - left position */}
      {icon && iconPosition === 'left' && !loading && (
        <span className={cn('flex-shrink-0', children && 'mr-2')}>
          {icon}
        </span>
      )}
      
      {/* Button content */}
      {children && (
        <span className={loading ? 'opacity-70' : ''}>
          {children}
        </span>
      )}
      
      {/* Icon - right position */}
      {icon && iconPosition === 'right' && !loading && (
        <span className={cn('flex-shrink-0', children && 'ml-2')}>
          {icon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

// Button group component for related actions
export const ButtonGroup = ({ 
  children, 
  orientation = 'horizontal',
  className,
  ...props 
}) => {
  const groupClasses = cn(
    'inline-flex',
    orientation === 'horizontal' 
      ? 'flex-row [&>button:not(:first-child)]:ml-[-1px] [&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none'
      : 'flex-col [&>button:not(:first-child)]:mt-[-1px] [&>button:not(:first-child)]:rounded-t-none [&>button:not(:last-child)]:rounded-b-none',
    className
  );

  return (
    <div className={groupClasses} {...props}>
      {children}
    </div>
  );
};

// Icon button component for icon-only buttons
export const IconButton = React.forwardRef(({ 
  icon, 
  'aria-label': ariaLabel,
  size = 'md',
  className,
  ...props 
}, ref) => {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8', 
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  };

  return (
    <Button
      ref={ref}
      className={cn(
        'p-0',
        iconSizes[size],
        className
      )}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

// Floating Action Button component
export const FAB = React.forwardRef(({ 
  icon,
  label,
  position = 'bottom-right',
  className,
  ...props 
}, ref) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  return (
    <Button
      ref={ref}
      variant="primary"
      size="lg"
      className={cn(
        'rounded-full shadow-lg hover:shadow-xl',
        'w-14 h-14 p-0',
        'z-50',
        positionClasses[position],
        className
      )}
      aria-label={label}
      {...props}
    >
      {icon}
    </Button>
  );
});

FAB.displayName = 'FAB';

export default Button;