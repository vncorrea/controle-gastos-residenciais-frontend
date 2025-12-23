import React from 'react';
import './Card.css';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle,
  icon,
  children, 
  className = '' 
}) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <>
          <h2 className="card-title">
            {icon && <span className="card-icon">{icon}</span>}
            {title}
          </h2>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
};
