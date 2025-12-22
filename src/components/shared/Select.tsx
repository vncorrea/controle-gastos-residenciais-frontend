import React, { SelectHTMLAttributes } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './Select.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  required = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="select-wrapper">
      {label && (
        <label className={required ? 'required' : ''}>
          {label}
          {required && <span className="required-asterisk"> *</span>}
        </label>
      )}
      <div className={`select-container ${error ? 'has-error' : ''} ${props.disabled ? 'disabled' : ''}`}>
        <select className={`custom-select ${className}`} {...props}>
          {children}
        </select>
        <FaChevronDown className="select-icon" />
      </div>
      {error && <span className="select-error">{error}</span>}
    </div>
  );
};
