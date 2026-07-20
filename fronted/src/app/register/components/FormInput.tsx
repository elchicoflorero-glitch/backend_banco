interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

export function FormInput({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  disabled,
}: FormInputProps) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
