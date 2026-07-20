'use client';

import { Toast as ToastType } from '@/contexts/ToastContext';
import { useEffect, useState } from 'react';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg
            style={{
              width: '1.25rem',
              height: '1.25rem',
              color: '#22c55e',
              flexShrink: 0,
            }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'error':
        return (
          <svg
            style={{
              width: '1.25rem',
              height: '1.25rem',
              color: '#ef4444',
              flexShrink: 0,
            }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            style={{
              width: '1.25rem',
              height: '1.25rem',
              color: '#f59e0b',
              flexShrink: 0,
            }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            style={{
              width: '1.25rem',
              height: '1.25rem',
              color: '#3b82f6',
              flexShrink: 0,
            }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zm5 0a1 1 0 11-2 0 1 1 0 012 0z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return '#f0fdf4';
      case 'error':
        return '#fef2f2';
      case 'warning':
        return '#fffbeb';
      default:
        return '#eff6ff';
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return '#22c55e';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return '#166534';
      case 'error':
        return '#b91c1c';
      case 'warning':
        return '#92400e';
      default:
        return '#1e40af';
    }
  };

  return (
    <div
      style={{
        background: getBackgroundColor(),
        borderLeft: `4px solid ${getBorderColor()}`,
        borderRadius: '0.375rem',
        padding: '1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        animation: isExiting
          ? 'slideOutRight 0.3s ease-in-out forwards'
          : 'slideInRight 0.3s ease-in-out forwards',
      } as React.CSSProperties}
    >
      {getIcon()}
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: getTextColor(),
            fontWeight: 500,
          }}
        >
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          color: getBorderColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          style={{ width: '1.25rem', height: '1.25rem' }}
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

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
