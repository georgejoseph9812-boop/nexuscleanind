import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showValue = true,
  color = 'primary', // 'primary' | 'secondary' | 'warning' | 'critical'
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const colors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    warning: 'bg-amber-500',
    critical: 'bg-rose-500',
    eco: 'bg-eco-600'
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-slate-600">{label}</span>}
          {showValue && <span className="font-semibold text-slate-900">{percentage}%</span>}
        </div>
      )}

      <div className={`w-full rounded-full bg-slate-100 overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colors[color] || colors.primary}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
