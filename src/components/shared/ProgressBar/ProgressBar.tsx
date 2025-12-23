import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color,
  showLabel = true,
}) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="progress-bar-container">
      {showLabel && (
        <span className="progress-bar-label">{clampedPercentage.toFixed(1)}%</span>
      )}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{
            width: `${clampedPercentage}%`,
            backgroundColor: color || 'var(--primary-color)',
          }}
        />
      </div>
    </div>
  );
};
