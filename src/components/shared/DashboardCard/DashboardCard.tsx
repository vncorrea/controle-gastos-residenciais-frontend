import React from 'react';
import './DashboardCard.css';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  className = '',
}) => {
  return (
    <div className={`dashboard-card ${className}`}>
      <div className="dashboard-card-content">
        <div className="dashboard-card-header">
          <h3 className="dashboard-card-title">{title}</h3>
          {icon && <div className="dashboard-card-icon">{icon}</div>}
        </div>
        <div className="dashboard-card-value">{value}</div>
        {subtitle && <div className="dashboard-card-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};
