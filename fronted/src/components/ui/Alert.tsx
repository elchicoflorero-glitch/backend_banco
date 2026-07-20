import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export default function Alert({ type, title, message, onClose, className = '' }: AlertProps) {
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const titleColors = {
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-blue-900',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`border rounded-md p-4 ${typeStyles[type]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0 text-lg font-bold mr-3">{icons[type]}</div>
        <div className="flex-1">
          {title && <h3 className={`font-medium mb-1 ${titleColors[type]}`}>{title}</h3>}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-sm font-medium hover:opacity-75 transition-opacity"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
