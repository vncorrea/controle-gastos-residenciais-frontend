import React from 'react';
import './FormField.css';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  required = false,
}) => {
  return (
    <div className="form-field">
      <label className={required ? 'required' : ''}>
        {label}
        {required && <span className="required-asterisk"> *</span>}
      </label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
