// components/ui/StatusBadge.jsx - Status badge component

export const StatusBadge = ({
  status = 'default',
  size = 'md',
  variant = 'filled',
  children,
  className,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm'
  };

  const statusStyles = {
    filled: {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      primary: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    },
    outline: {
      default: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
      primary: 'border border-emerald-300 text-emerald-700 dark:border-emerald-600 dark:text-emerald-400',
      success: 'border border-green-300 text-green-700 dark:border-green-600 dark:text-green-400',
      warning: 'border border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400',
      danger: 'border border-red-300 text-red-700 dark:border-red-600 dark:text-red-400',
      info: 'border border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-400',
      completed: 'border border-green-300 text-green-700 dark:border-green-600 dark:text-green-400',
      pending: 'border border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400',
      draft: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
      processing: 'border border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-400',
      error: 'border border-red-300 text-red-700 dark:border-red-600 dark:text-red-400'
    }
  };

  const statusIcons = {
    completed: (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
    processing: (
      <LoadingSpinner size="xs" className="mr-1" />
    ),
    error: (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    pending: (
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    )
  };

  return (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        statusStyles[variant][status],
        className
      )}
      {...props}
    >
      {statusIcons[status]}
      {children}
    </span>
  );
};

// Animated status badge with dot indicator
export const StatusDot = ({
  status = 'default',
  animated = false,
  children,
  className,
  ...props
}) => {
  const dotColors = {
    default: 'bg-gray-400',
    success: 'bg-green-400',
    warning: 'bg-yellow-400', 
    danger: 'bg-red-400',
    info: 'bg-blue-400',
    completed: 'bg-green-400',
    pending: 'bg-yellow-400',
    processing: 'bg-blue-400',
    error: 'bg-red-400'
  };

  return (
    <div className={cn('flex items-center', className)} {...props}>
      <div className="relative mr-2">
        <div className={cn('w-2 h-2 rounded-full', dotColors[status])} />
        {animated && (
          <div className={cn(
            'absolute inset-0 w-2 h-2 rounded-full animate-ping',
            dotColors[status],
            'opacity-75'
          )} />
        )}
      </div>
      {children && (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {children}
        </span>
      )}
    </div>
  );
};
