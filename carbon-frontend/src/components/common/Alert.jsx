import { useState, useEffect } from 'react';
import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';

/**
 * Alert Component - Reusable Alert with Icons (CoreUI Style)
 * 
 * @param {string} variant - Alert type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
 * @param {string} title - Optional title text
 * @param {ReactNode} children - Alert content
 * @param {boolean} dismissible - Show close button
 * @param {function} onDismiss - Callback when dismissed
 * @param {string} className - Additional CSS classes
 * @param {string} position - Alert position: 'inline' | 'toast' (default: 'inline')
 */
const Alert = ({ 
  variant = 'primary', 
  title, 
  children, 
  dismissible = false,
  onDismiss,
  className = '',
  position = 'inline' // 'inline' or 'toast'
}) => {
  const [isDismissing, setIsDismissing] = useState(false);


  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300); // Match animation duration
  };
  const variants = {
    primary: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
      Icon: Info
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      iconBg: 'bg-green-100',
      Icon: CheckCircle
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      Icon: AlertTriangle
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
      Icon: AlertCircle
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
      Icon: AlertCircle
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
      Icon: Info
    }
  };

  const style = variants[variant] || variants.primary;
  const Icon = style.Icon;

  // Ensure background color is always applied
  const isToast = position === 'toast';
  const baseClasses = `
    ${style.bg} ${style.border} border-2 rounded-xl p-4 
    flex items-center gap-3
    transition-all duration-300 ease-in-out
    ${isToast ? 'shadow-lg' : 'hover:shadow-md hover:scale-[1.01]'}
    ${isDismissing 
      ? (isToast ? 'alert-toast-slide-out pointer-events-none' : 'alert-fade-out pointer-events-none') 
      : (isToast ? 'alert-toast-slide-in' : 'alert-fade-in')
    }
  `.trim().replace(/\s+/g, ' ');

  // Ensure component always renders when children exist
  if (!children) {
    return null;
  }

  // Toast position styles
  const toastStyles = isToast ? {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    minWidth: '280px',
    maxWidth: '600px', // Increased max width for longer messages
    width: 'fit-content', // Auto-size based on content
    whiteSpace: 'normal' // Allow text wrapping
  } : {};

  return (
    <div 
      className={`${baseClasses} ${className}`}
      role="alert"
      style={{
        animationFillMode: 'both',
        display: 'flex',
        visibility: isDismissing ? 'hidden' : 'visible',
        opacity: isDismissing ? 0 : 1,
        minHeight: isToast ? 'auto' : '60px',
        ...(isToast ? {} : { width: '100%' }), // Only set width for inline alerts
        ...toastStyles // Toast styles will override if isToast is true
      }}
    >
      {/* Icon with pop animation */}
      <div 
        className={`
          ${style.iconBg} ${style.icon} rounded-lg p-1.5 flex-shrink-0
          ${isDismissing ? '' : 'alert-icon-pop'}
        `}
      >
        <Icon className="w-5 h-5" />
      </div>
      
      {/* Content with slide animation */}
      <div 
        className={`${isToast ? 'flex-auto' : 'flex-1'} min-w-0 break-words`}
        style={{
          animation: isDismissing 
            ? 'none' 
            : 'slideIn 0.4s ease-out 0.15s both',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          ...(isToast ? { maxWidth: '100%' } : {})
        }}
      >
        {title && (
          <h4 className={`${style.text} font-semibold text-base mb-1`}>
            {title}
          </h4>
        )}
        <div className={`${style.text} ${isToast ? 'text-base' : 'text-sm'} ${title ? '' : 'font-medium'}`}>
          {children}
        </div>
      </div>
      
      {/* Dismiss Button with hover animation */}
      {dismissible && onDismiss && (
        <button
          onClick={handleDismiss}
          className={`
            ${style.text} flex-shrink-0 p-1.5 rounded-lg
            transition-all duration-200 ease-in-out
            hover:opacity-80 hover:scale-110 hover:bg-white hover:bg-opacity-50
            active:scale-95
            ${isDismissing ? 'opacity-0' : 'opacity-100'}
          `}
          aria-label="Đóng"
          style={{
            animation: isDismissing 
              ? 'none' 
              : 'fadeIn 0.3s ease-out 0.2s both'
          }}
        >
          <X className="w-4 h-4 transition-transform duration-200" />
        </button>
      )}
    </div>
  );
};

export default Alert;

