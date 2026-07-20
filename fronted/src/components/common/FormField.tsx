import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  icon?: ReactNode;
}

export function FormField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  hint,
  icon,
}: FormFieldProps) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input ${error ? 'input-error' : ''} ${icon ? 'pl-10' : ''}`}
        />
      </div>
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}
