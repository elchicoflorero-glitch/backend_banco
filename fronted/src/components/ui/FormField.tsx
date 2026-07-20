import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  children,
  className = '',
}: FormFieldProps) {
  const baseInputClass = `w-full px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors`;
  const errorClass = error ? 'border-red-500 bg-red-50' : 'border-gray-300';
  const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseInputClass} ${errorClass} ${disabledClass}`}
          rows={4}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseInputClass} ${errorClass} ${disabledClass}`}
        >
          <option value="">Selecciona una opción</option>
          {children}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseInputClass} ${errorClass} ${disabledClass}`}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
